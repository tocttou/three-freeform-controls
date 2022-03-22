import * as THREE from "three";
import * as FreeformControls from "../dist/three-freeform-controls";

/**
 * This is a 3D marker to move and rotate an object in the scene.
 *
 * @example
 * import { Marker, MarkerEvents } from "./marker";
 * const marker = new Marker(this.camera, this.renderer.domElement, 1.4, 0.6, 0.2, 1.2);
 * this.marker.link(sphere);
 * marker.listen(MarkerEvents.EVENTS.DRAG_START, () => {
 *   this.orbit.enabled = false;
 * });
 * marker.listen(MarkerEvents.EVENTS.DRAG_STOP, () => {
 *   this.orbit.enabled = true;
 * });
 * this.scene.add(marker);
 */
export class Marker extends FreeformControls.ControlsManager {
  constructor(
    camera: THREE.Camera,
    domElement: HTMLElement,
    private minRingRadius: number,
    private ringSize: number,
    private arrowRadius: number,
    private arrowLength: number
  ) {
    super(camera, domElement);
  }

  public link = (object: THREE.Object3D): THREE.Group => {
    const controls = this.anchor(object, {
      hideOtherHandlesOnDrag: true,
      hideOtherControlsInstancesOnDrag: false,
      highlightAxis: true,
      mode: FreeformControls.ANCHOR_MODE.INHERIT,
    });

    controls.showAll(false);
    controls.setupHandle(new XTranslation(this.minRingRadius, this.arrowRadius, this.arrowLength));
    controls.setupHandle(new YTranslation(this.minRingRadius, this.arrowRadius, this.arrowLength));
    controls.setupHandle(new ZTranslation(this.minRingRadius, this.arrowRadius, this.arrowLength));
    controls.setupHandle(new XRotation(this.minRingRadius, this.ringSize));
    controls.setupHandle(new YRotation(this.minRingRadius, this.ringSize));
    controls.setupHandle(new ZRotation(this.minRingRadius, this.ringSize));
    return controls;
  };
}

class RingFactory {
  public static createRing = (
    minRadius: number,
    maxRadius: number,
    color: number
  ): THREE.Mesh[] => {
    const sectors = 40;
    const geometry = new THREE.RingBufferGeometry(minRadius, maxRadius, sectors);

    // Assign an index to each face, either 0 or 1, used to select a materials.
    const pattern = [0, 1, 1, 0];
    for (let i = 0; i < 2 * sectors; i++) {
      geometry.addGroup(3 * i, 3, pattern[i % 4]);
    }

    // Create the materials.
    const material = [
      new THREE.MeshStandardMaterial({
        color: color,
        side: THREE.DoubleSide,
      }),
      new THREE.MeshStandardMaterial({
        color: color,
        opacity: 0.5,
        transparent: true,
        side: THREE.DoubleSide,
      }),
    ];

    const meshes: THREE.Mesh[] = [];
    meshes.push(new THREE.Mesh(geometry, material));
    return meshes;
  };
}

/**
 * Create an arrow sitting on the origin and pointing in the direction of the y-axis.
 */
class ArrowFactory {
  public static createArrow = (
    minRingRadius: number,
    arrowRadius: number,
    arrowLength: number,
    color: number
  ): THREE.Mesh[] => {
    const radialSegments = 32;
    const material = new THREE.MeshStandardMaterial({ color: color });
    const meshes: THREE.Mesh[] = [];
    meshes.push(
      new THREE.Mesh(
        new THREE.CylinderGeometry(arrowRadius, arrowRadius, arrowLength, radialSegments).translate(
          0,
          arrowLength / 2,
          0
        ),
        material
      )
    );
    meshes.push(
      new THREE.Mesh(
        new THREE.ConeGeometry(2 * arrowRadius, 2 * arrowRadius, radialSegments).translate(
          0,
          arrowLength + arrowRadius,
          0
        ),
        material
      )
    );
    return meshes;
  };
}

/**
 * Handler to rotate the marker around the X axis.
 */
class XRotation extends FreeformControls.RotationGroup {
  private meshes: THREE.Mesh[];
  constructor(private minRingRadius: number, private ringSize: number) {
    super();
    this.up = new THREE.Vector3(1, 0, 0);
    this.meshes = [];
    const ring = RingFactory.createRing(minRingRadius, minRingRadius + ringSize, 0xff0000);
    ring.forEach((mesh) => {
      mesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
    });
    this.meshes.push(...ring);
    this.add(...ring);
  }

  setColor(color: string): void {
    throw new Error("Method not implemented.");
  }

  getInteractiveObjects = (): THREE.Mesh[] => {
    return [...this.meshes];
  };
}

/**
 * Handler to rotate the marker around the Y axis.
 */
class YRotation extends FreeformControls.RotationGroup {
  private meshes: THREE.Mesh[];
  constructor(private minRingRadius: number, private ringSize: number) {
    super();
    this.up = new THREE.Vector3(0, 1, 0);
    this.meshes = [];
    const ring = RingFactory.createRing(minRingRadius, minRingRadius + ringSize, 0x00ff00);
    ring.forEach((mesh) => {
      mesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    });
    this.meshes.push(...ring);
    this.add(...ring);
  }

  setColor(color: string): void {
    throw new Error("Method not implemented.");
  }

  getInteractiveObjects = (): THREE.Mesh[] => {
    return [...this.meshes];
  };
}

/**
 * Handler to rotate the marker around the Z axis.
 */
class ZRotation extends FreeformControls.RotationGroup {
  private meshes: THREE.Mesh[];
  constructor(private minRingRadius: number, private ringSize: number) {
    super();
    this.meshes = [];
    this.up = new THREE.Vector3(0, 0, 1);
    const ring = RingFactory.createRing(minRingRadius, minRingRadius + ringSize, 0x0000ff);
    this.meshes.push(...ring);
    this.add(...ring);
  }

  setColor(color: string): void {
    throw new Error("Method not implemented.");
  }

  getInteractiveObjects = (): THREE.Mesh[] => {
    return [...this.meshes];
  };
}

/**
 * Handler to translate the marker along the X axis.
 */
class XTranslation extends FreeformControls.TranslationGroup {
  parallel: THREE.Vector3;
  private meshes: THREE.Mesh[];
  constructor(
    private minRingRadius: number,
    private arrowRadius: number,
    private arrowLength: number
  ) {
    super();
    this.up = new THREE.Vector3(0, 1, 0);
    this.parallel = new THREE.Vector3(1, 0, 0);

    this.meshes = [];
    const positiveArrow = ArrowFactory.createArrow(arrowRadius, arrowRadius, arrowLength, 0xff0000);
    positiveArrow.forEach((mesh) => {
      mesh.rotateOnAxis(new THREE.Vector3(0, 0, 1), -Math.PI / 2);
      mesh.translateOnAxis(new THREE.Vector3(0, 1, 0), minRingRadius);
    });
    this.meshes.push(...positiveArrow);
    this.add(...positiveArrow);

    const negativeArrow = ArrowFactory.createArrow(arrowRadius, arrowRadius, arrowLength, 0xff0000);
    negativeArrow.forEach((mesh) => {
      mesh.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 2);
      mesh.translateOnAxis(new THREE.Vector3(0, 1, 0), minRingRadius);
    });
    this.meshes.push(...negativeArrow);
    this.add(...negativeArrow);
  }

  setColor(color: string): void {
    throw new Error("Method not implemented.");
  }

  getInteractiveObjects = (): THREE.Mesh[] => {
    return [...this.meshes];
  };
}

/**
 * Handler to translate the marker along the Y axis.
 */
class YTranslation extends FreeformControls.TranslationGroup {
  parallel: THREE.Vector3;
  private meshes: THREE.Mesh[];
  constructor(
    private minRingRadius: number,
    private arrowRadius: number,
    private arrowLength: number
  ) {
    super();
    this.up = new THREE.Vector3(0, 0, 1);
    this.parallel = new THREE.Vector3(0, 1, 0);

    this.meshes = [];
    const positiveArrow = ArrowFactory.createArrow(arrowRadius, arrowRadius, arrowLength, 0x00ff00);
    positiveArrow.forEach((mesh) => {
      mesh.translateOnAxis(new THREE.Vector3(0, 1, 0), minRingRadius);
    });
    this.meshes.push(...positiveArrow);
    this.add(...positiveArrow);

    const negativeArrow = ArrowFactory.createArrow(arrowRadius, arrowRadius, arrowLength, 0x00ff00);
    negativeArrow.forEach((mesh) => {
      mesh.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI);
      mesh.translateOnAxis(new THREE.Vector3(0, 1, 0), minRingRadius);
    });
    this.meshes.push(...negativeArrow);
    this.add(...negativeArrow);
  }

  setColor(color: string): void {
    throw new Error("Method not implemented.");
  }

  getInteractiveObjects = (): THREE.Mesh[] => {
    return [...this.meshes];
  };
}

/**
 * Handler to translate the marker along the Z axis.
 */
class ZTranslation extends FreeformControls.TranslationGroup {
  parallel: THREE.Vector3;
  private meshes: THREE.Mesh[];
  constructor(
    private minRingRadius: number,
    private arrowRadius: number,
    private arrowLength: number
  ) {
    super();
    this.up = new THREE.Vector3(1, 0, 0);
    this.parallel = new THREE.Vector3(0, 0, 1);

    this.meshes = [];
    const positiveArrow = ArrowFactory.createArrow(arrowRadius, arrowRadius, arrowLength, 0x0000ff);
    positiveArrow.forEach((mesh) => {
      mesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
      mesh.translateOnAxis(new THREE.Vector3(0, 1, 0), minRingRadius);
    });
    this.meshes.push(...positiveArrow);
    this.add(...positiveArrow);

    const negativeArrow = ArrowFactory.createArrow(arrowRadius, arrowRadius, arrowLength, 0x0000ff);
    negativeArrow.forEach((mesh) => {
      mesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
      mesh.translateOnAxis(new THREE.Vector3(0, 1, 0), minRingRadius);
    });
    this.meshes.push(...negativeArrow);
    this.add(...negativeArrow);
  }

  setColor(color: string): void {
    throw new Error("Method not implemented.");
  }

  getInteractiveObjects = (): THREE.Mesh[] => {
    return [...this.meshes];
  };
}
