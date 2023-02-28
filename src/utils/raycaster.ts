import { emitter } from "./emmiter";
import Controls from "../controls";
import PickPlane from "../controls/handles/pick-plane";
import { PICK_PLANE_OPACITY } from "./constants";
import { IHandle, PickGroup, RotationGroup, TranslationGroup } from "../controls/handles";
import RotationEye from "../controls/handles/rotation-eye";
import { addEventListener, getPointFromEvent, removeEventListener } from "./helper";
import Line from "../primitives/line";
import * as THREE from "three";
import { EVENTS } from "./events";

/**
 * @hidden
 * The Raycaster listens on the mouse and touch events globally and
 * dispatches DRAG_START, DRAG, and DRAG_STOP events.
 */
export default class Raycaster extends THREE.Raycaster {
  private mouse = new THREE.Vector2();
  private cameraPosition = new THREE.Vector3();
  private activeHandle: IHandle | null = null;
  private point = new THREE.Vector3();
  private visibleHandles: THREE.Object3D[] = [];
  private visibleControls: THREE.Object3D[] = [];
  private clientDiagonalLength = 1;
  private previousScreenPoint = new THREE.Vector2();
  private currentScreenPoint = new THREE.Vector2();
  private readonly highlightAxisLine: Line;

  constructor(
    public camera: THREE.Camera,
    private domElement: HTMLElement,
    private controls: { [id: string]: Controls }
  ) {
    super();
    this.highlightAxisLine = this.createAxisLine();
    /**
     * mousedown and touchstart are used instead of pointerdown because
     * pointermove seems to stop firing after some a few events in chrome mobile
     * this could be because of some capture/passive setting but couldn't find
     * anything useful. using touch(*) events works.
     */
    addEventListener(this.domElement, ["pointerdown", "touchstart"], this.pointerDownListener, {
      passive: false,
      capture: true,
    });
    addEventListener(this.domElement, ["pointerup", "touchend"], this.pointerUpListener, {
      passive: false,
      capture: true,
    });
  }

  private createAxisLine = () => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, -100, 0, 0, 100], 3));
    return new Line("white", geometry);
  };

  /**
   * Find the handle the user clicked on.
   */
  private findActiveHandle = (): IHandle | null => {
    const interactiveObjects: THREE.Object3D[] = [];
    Object.values(this.controls).map((controls) => {
      interactiveObjects.push(...controls.getInteractiveObjects());
    });
    return this.resolveHandleGroup(super.intersectObjects(interactiveObjects, true)[0]);
  };

  /**
   * Find the closest points between two rays.
   */
  private findClosestPoints(rayA: THREE.Ray, rayB: THREE.Ray): [THREE.Vector3, THREE.Vector3] {
    // For accurate description on how to calculate these points see
    // https://stackoverflow.com/questions/58151978/threejs-how-to-calculate-the-closest-point-on-a-three-ray-to-another-three-ray

    // The line which is formed by the 2 points which are closest to each
    // another, is normal to the 2 rays.
    // The first step is to find the direction vector of the line which is
    // formed by the 2 closest points. Since the vector is normal to both
    // rays, this can be done by the cross product.
    const Nv = rayA.direction.clone().cross(rayB.direction);
    // The next step is to find a plane for eache ray, which includes the
    // ray and the closest point on the other ray. A plane is formed by 2
    // vectors, in this case the direction vector of the plane and nv.
    // We need a different representation of the plane, by a point and a
    // normal vector. The point is the origin of the ray. The normal vector
    // again can be get by the cross product. For the further calculations,
    // this vectors have to be unit vectors (length is 1), so they are
    // normalized:
    const Na = rayA.direction.clone().cross(Nv).normalize();
    const Nb = rayB.direction.clone().cross(Nv).normalize();
    // Now the issue is the intersection of a ray and plane. ptA and ptB
    // are Vector3 objects and the closest points on the ray:
    const Da = rayA.direction.clone().normalize();
    const Db = rayB.direction.clone().normalize();
    const da = rayB.origin.clone().sub(rayA.origin).dot(Nb) / Da.dot(Nb);
    const db = rayA.origin.clone().sub(rayB.origin).dot(Na) / Db.dot(Na);
    const pointA = rayA.origin.clone().add(Da.multiplyScalar(da));
    const pointB = rayB.origin.clone().add(Db.multiplyScalar(db));

    return [pointA, pointB];
  }

  /**
   * Hide other control instances on drag if asked.
   */
  private hideOtherControlsInstancesOnDrag = (activeHandle: IHandle) => {
    if (activeHandle?.parent) {
      const controls = activeHandle.parent as Controls;
      if (controls.hideOtherControlsInstancesOnDrag) {
        Object.values(this.controls).forEach((x) => {
          if (x.visible) {
            this.visibleControls.push(x);
          }
          x.visible = false;
        });
        controls.visible = true;
      }
    }
  };

  /**
   * Hide other handles on drag if asked.
   */
  private hideOtherHandlesOnDrag = (activeHandle: IHandle) => {
    if (activeHandle?.parent) {
      const controls = activeHandle.parent as Controls;
      if (controls.hideOtherHandlesOnDrag) {
        controls.children.map((handle) => {
          if (handle.visible) {
            this.visibleHandles.push(handle);
          }
          handle.visible = false;
        });
        activeHandle.visible = true;
      }
    }
  };

  /**
   * Show the operation axis if asked. Available only for TranslationGroup
   * and RotationGroup (except RotationEye where plane of rotation is obvious).
   */
  private showAxis = (activeHandle: IHandle) => {
    if (activeHandle?.parent) {
      const controls = activeHandle.parent as Controls;
      if (
        controls.highlightAxis &&
        (this.activeHandle instanceof TranslationGroup ||
          this.activeHandle instanceof RotationGroup) &&
        !(this.activeHandle instanceof RotationEye)
      ) {
        //The highlighted axis always passes through the center of the parent object.
        activeHandle.parent.getWorldPosition(this.highlightAxisLine.position);

        // Find the direction vector of the selected handler, either parallel or up.
        // Rotate this vector by the parent component world quaternion.
        // Place the vector at the center of the parent component and calculate
        // the second point of the highlighted axis.
        const quaternion = new THREE.Quaternion();
        activeHandle.parent.getWorldQuaternion(quaternion);
        let direction: THREE.Vector3;
        if (this.activeHandle instanceof TranslationGroup) {
          direction = this.activeHandle.parallel.clone();
        } else {
          direction = this.activeHandle.up.clone();
        }
        direction.applyQuaternion(quaternion);
        const point = this.highlightAxisLine.position.clone().add(direction);
        this.highlightAxisLine.lookAt(point);

        const scene = controls.parent as THREE.Scene;
        scene.add(this.highlightAxisLine);
      }
    }
  };

  /**
   * Determine the Active Plane i.e. the plane on which intersection actions
   * take place. An Active Plane is used during rotation operations.
   * Mouse movements are translated to points on the Active Plane.
   */
  private calculateActivePlane = (activeHandle: IHandle): THREE.Plane => {
    const activePlane = new THREE.Plane();
    if (activeHandle?.parent) {
      const controls = activeHandle.parent as Controls;
      const eyePlaneNormal = this.getEyePlaneNormal(activeHandle);
      const normal = new THREE.Vector3();
      normal.copy(activeHandle instanceof PickGroup ? eyePlaneNormal : activeHandle.up);
      if (!(activeHandle instanceof RotationEye || activeHandle instanceof PickGroup)) {
        const quaternion = new THREE.Quaternion();
        controls.getWorldQuaternion(quaternion);
        normal.applyQuaternion(quaternion);
      }
      if (activeHandle instanceof TranslationGroup) {
        activePlane.setFromNormalAndCoplanarPoint(normal, activeHandle.position);
      } else {
        activePlane.setFromNormalAndCoplanarPoint(normal, controls.position);
      }
    }
    return activePlane;
  };

  /**
   * Find the initial point representing the translation, either by intersecting
   * the view ray with the current active plane, or by calculating the closest
   * point on the translation axis to the view ray.
   */
  private calculateManipulationPoint = (): THREE.Vector3 => {
    const manipulationPoint = new THREE.Vector3();
    if (this.activeHandle?.parent) {
      if (this.activeHandle instanceof PickGroup) {
        this.activeHandle.getWorldPosition(manipulationPoint);
      } else if (this.activeHandle instanceof TranslationGroup) {
        // Translation ray.
        const axisOrigin = new THREE.Vector3();
        this.activeHandle.parent.getWorldPosition(axisOrigin);
        const quaternion = new THREE.Quaternion();
        this.activeHandle.parent.getWorldQuaternion(quaternion);
        const axisDirection = this.activeHandle.parallel.clone().applyQuaternion(quaternion);
        const axisRay = new THREE.Ray(axisOrigin, axisDirection);
        const point = this.findClosestPoints(this.ray, axisRay)[0];
        manipulationPoint.copy(point);
      } else {
        const activePlane = this.calculateActivePlane(this.activeHandle);
        if (activePlane) {
          this.ray.intersectPlane(activePlane, manipulationPoint);
        }
      }
    }
    return manipulationPoint;
  };

  /**
   * This method is executed when the mouse is pressed.
   */
  private pointerDownListener = (event: MouseEvent | TouchEvent) => {
    const point = getPointFromEvent(event);

    // Touches can be empty.
    if (!point) {
      return;
    }
    const { clientX, clientY } = point;
    this.setRayDirection(clientX, clientY);

    // Useful for calculating dragRatio (used in dampingFactor calculation).
    this.clientDiagonalLength = Math.sqrt(
      (event.target as HTMLElement).clientWidth ** 2 +
        (event.target as HTMLElement).clientHeight ** 2
    );
    this.previousScreenPoint.set(clientX, clientY);

    this.activeHandle = this.findActiveHandle();
    if (this.activeHandle?.parent) {
      this.hideOtherControlsInstancesOnDrag(this.activeHandle);
      this.hideOtherHandlesOnDrag(this.activeHandle);

      if (this.activeHandle instanceof PickPlane) {
        this.setPickPlaneOpacity(PICK_PLANE_OPACITY.ACTIVE);
      }

      this.showAxis(this.activeHandle);

      // switch event listeners and dispatch DRAG_START
      removeEventListener(
        this.domElement,
        ["pointerdown", "touchstart"],
        this.pointerDownListener,
        {
          capture: true,
        }
      );

      const initialIntersectionPoint = this.calculateManipulationPoint();
      emitter.emit(EVENTS.DRAG_START, {
        point: initialIntersectionPoint,
        handle: this.activeHandle,
      });
      addEventListener(this.domElement, ["pointermove", "touchmove"], this.pointerMoveListener, {
        passive: false,
        capture: true,
      });
    }
  };

  /**
   * Return the normal of the plane perpendicular to the view direction and
   * passing by the given object.
   */
  private getEyePlaneNormal = (object: THREE.Object3D) => {
    this.cameraPosition.copy(this.camera.position);
    return this.cameraPosition.sub(object.position);
  };

  private setRayDirection = (clientX: number, clientY: number) => {
    const rect = this.domElement.getBoundingClientRect();
    const { clientHeight, clientWidth } = this.domElement;
    this.mouse.x = ((clientX - rect.left) / clientWidth) * 2 - 1;
    this.mouse.y = -((clientY - rect.top) / clientHeight) * 2 + 1;
    this.setFromCamera(this.mouse, this.camera);
  };

  private pointerMoveListener = (event: MouseEvent | TouchEvent) => {
    if (this.activeHandle === null) {
      return;
    }
    const point = getPointFromEvent(event);
    if (!point) {
      return;
    }
    const { clientX, clientY } = point;

    this.setRayDirection(clientX, clientY);

    this.point = this.calculateManipulationPoint();

    this.currentScreenPoint.set(clientX, clientY);
    const distance = this.currentScreenPoint.distanceTo(this.previousScreenPoint);
    const dragRatio = distance / (this.clientDiagonalLength || 1);

    emitter.emit(EVENTS.DRAG, {
      point: this.point,
      handle: this.activeHandle,
      dragRatio,
    });

    this.previousScreenPoint.set(clientX, clientY);
  };

  private pointerUpListener = () => {
    removeEventListener(this.domElement, ["pointermove", "touchmove"], this.pointerMoveListener, {
      capture: true,
    });
    addEventListener(this.domElement, ["pointerdown", "touchstart"], this.pointerDownListener, {
      passive: false,
      capture: true,
    });
    emitter.emit(EVENTS.DRAG_STOP, { point: this.point, handle: this.activeHandle });

    if (
      this.activeHandle?.parent &&
      (this.activeHandle.parent as Controls).hideOtherControlsInstancesOnDrag
    ) {
      this.visibleControls.forEach((controls) => {
        controls.visible = true;
      });
      this.visibleControls = [];
    }

    if (
      this.activeHandle?.parent &&
      (this.activeHandle.parent as Controls).hideOtherHandlesOnDrag
    ) {
      this.visibleHandles.forEach((handle) => {
        handle.visible = true;
      });
      this.visibleHandles = [];
    }

    if (this.activeHandle instanceof PickPlane) {
      this.setPickPlaneOpacity(PICK_PLANE_OPACITY.INACTIVE);
    }

    const scene = this.activeHandle?.parent?.parent;
    if (scene) {
      scene.remove(this.highlightAxisLine);
    }
    this.activeHandle = null;
  };

  private setPickPlaneOpacity(opacity: number) {
    if (!(this.activeHandle instanceof PickPlane)) {
      return;
    }
    const material = this.activeHandle.plane.material;
    if (Array.isArray(material)) {
      material.map((m) => {
        m.opacity = opacity;
        m.needsUpdate = true;
      });
    } else {
      material.opacity = opacity;
      material.needsUpdate = true;
    }
  }

  private resolveHandleGroup = (intersectedObject: THREE.Intersection | undefined) => {
    if (intersectedObject === undefined) {
      return null;
    }

    return intersectedObject.object.parent as IHandle;
  };

  public destroy = () => {
    this.activeHandle = null;
    removeEventListener(this.domElement, ["pointerdown", "touchstart"], this.pointerDownListener, {
      capture: true,
    });
    removeEventListener(this.domElement, ["pointermove", "touchmove"], this.pointerMoveListener, {
      capture: true,
    });
    removeEventListener(this.domElement, ["pointerup", "touchend"], this.pointerUpListener, {
      capture: true,
    });
  };
}
