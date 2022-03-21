import * as THREE from "three";
import { Mesh } from "three";
import * as FreeformControls from "../dist/three-freeform-controls";

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
      highlightAxis: false,
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

class Ring extends THREE.Mesh {
  constructor(private minRadius: number, private maxRadius: number, private color: number) {
    super();

    const sectors = 40;
    this.geometry = new THREE.RingBufferGeometry(minRadius, maxRadius, sectors);

    // Assing an index to each face, either 0 or 1, used to select a materials.
    const pattern = [0, 1, 1, 0];
    for (let i = 0; i < 2 * sectors; i++) {
      this.geometry.addGroup(3 * i, 3, pattern[i % 4]);
    }

    // Create the materials.
    this.material = [
      new THREE.MeshStandardMaterial({
        color: this.color,
        side: THREE.DoubleSide,
      }),
      new THREE.MeshStandardMaterial({
        color: this.color,
        opacity: 0.5,
        transparent: true,
        side: THREE.DoubleSide,
      }),
    ];
  }
}

/**
 * Handler to rotate the marker around the X axis.
 */
class XRotation extends FreeformControls.RotationGroup {
  private ring: Ring;
  constructor(private minRingRadius: number, private ringSize: number) {
    super();
    this.up = new THREE.Vector3(1, 0, 0);
    this.ring = new Ring(minRingRadius, minRingRadius + ringSize, 0xff0000);
    this.ring.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
    this.add(this.ring);
  }

  getInteractiveObjects = (): THREE.Object3D[] => {
    return [this.ring];
  };
}

/**
 * Handler to rotate the marker around the Y axis.
 */
class YRotation extends FreeformControls.RotationGroup {
  private ring: Ring;
  constructor(private minRingRadius: number, private ringSize: number) {
    super();
    this.up = new THREE.Vector3(0, 1, 0);
    this.ring = new Ring(minRingRadius, minRingRadius + ringSize, 0x00ff00);
    this.ring.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    this.add(this.ring);
  }

  getInteractiveObjects = (): THREE.Object3D[] => {
    return [this.ring];
  };
}

/**
 * Handler to rotate the marker around the Z axis.
 */
class ZRotation extends FreeformControls.RotationGroup {
  private ring: Ring;
  constructor(private minRingRadius: number, private ringSize: number) {
    super();
    this.up = new THREE.Vector3(0, 0, 1);
    this.ring = new Ring(minRingRadius, minRingRadius + ringSize, 0x0000ff);
    this.add(this.ring);
  }

  getInteractiveObjects = (): THREE.Object3D[] => {
    return [this.ring];
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

    const radialSegments = 32;
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });

    this.meshes = [];
    this.meshes.push(
      new Mesh(
        new THREE.CylinderGeometry(arrowRadius, arrowRadius, arrowLength, radialSegments)
          .rotateZ(Math.PI / 2)
          .translate(minRingRadius + arrowLength / 2, 0, 0),
        material
      )
    );
    this.meshes.push(
      new Mesh(
        new THREE.CylinderGeometry(arrowRadius, arrowRadius, arrowLength, radialSegments)
          .rotateZ(Math.PI / 2)
          .translate(-minRingRadius - arrowLength / 2, 0, 0),
        material
      )
    );
    this.meshes.push(
      new Mesh(
        new THREE.ConeGeometry(2 * arrowRadius, 2 * arrowRadius, radialSegments)
          .rotateZ(-Math.PI / 2)
          .translate(minRingRadius + arrowLength + arrowRadius, 0, 0),
        material
      )
    );
    this.meshes.push(
      new Mesh(
        new THREE.ConeGeometry(2 * arrowRadius, 2 * arrowRadius, radialSegments)
          .rotateZ(Math.PI / 2)
          .translate(-minRingRadius - arrowLength - arrowRadius, 0, 0),
        material
      )
    );
    this.meshes.map((mesh: Mesh) => {
      this.add(mesh);
    });

    this.up = new THREE.Vector3(0, 1, 0);
    this.parallel = new THREE.Vector3(1, 0, 0);
  }

  getInteractiveObjects = (): THREE.Object3D[] => {
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

    const radialSegments = 32;
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

    this.meshes = [];
    this.meshes.push(
      new Mesh(
        new THREE.CylinderGeometry(arrowRadius, arrowRadius, arrowLength, radialSegments).translate(
          0,
          minRingRadius + arrowLength / 2,
          0
        ),
        material
      )
    );
    this.meshes.push(
      new Mesh(
        new THREE.CylinderGeometry(arrowRadius, arrowRadius, arrowLength, radialSegments).translate(
          0,
          -minRingRadius - arrowLength / 2,
          0
        ),
        material
      )
    );
    this.meshes.push(
      new Mesh(
        new THREE.ConeGeometry(2 * arrowRadius, 2 * arrowRadius, radialSegments).translate(
          0,
          minRingRadius + arrowLength + arrowRadius,
          0
        ),
        material
      )
    );
    this.meshes.push(
      new Mesh(
        new THREE.ConeGeometry(2 * arrowRadius, 2 * arrowRadius, radialSegments)
          .rotateX(-Math.PI)
          .translate(0, -minRingRadius - arrowLength - arrowRadius, 0),
        material
      )
    );
    this.meshes.map((mesh: Mesh) => {
      this.add(mesh);
    });

    this.up = new THREE.Vector3(0, 0, 1);
    this.parallel = new THREE.Vector3(0, 1, 0);
  }

  getInteractiveObjects = (): THREE.Object3D[] => {
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

    const radialSegments = 32;
    const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });

    this.meshes = [];
    this.meshes.push(
      new Mesh(
        new THREE.CylinderGeometry(arrowRadius, arrowRadius, arrowLength, radialSegments)
          .rotateX(Math.PI / 2)
          .translate(0, 0, minRingRadius + arrowLength / 2),
        material
      )
    );
    this.meshes.push(
      new Mesh(
        new THREE.CylinderGeometry(arrowRadius, arrowRadius, arrowLength, radialSegments)
          .rotateX(Math.PI / 2)
          .translate(0, 0, -minRingRadius - arrowLength / 2),
        material
      )
    );
    this.meshes.push(
      new Mesh(
        new THREE.ConeGeometry(2 * arrowRadius, 2 * arrowRadius, radialSegments)
          .rotateX(Math.PI / 2)
          .translate(0, 0, minRingRadius + arrowLength + arrowRadius),
        material
      )
    );
    this.meshes.push(
      new Mesh(
        new THREE.ConeGeometry(2 * arrowRadius, 2 * arrowRadius, radialSegments)
          .rotateX(-Math.PI / 2)
          .translate(0, 0, -minRingRadius - arrowLength - arrowRadius),
        material
      )
    );
    this.meshes.map((mesh: Mesh) => {
      this.add(mesh);
    });

    this.up = new THREE.Vector3(1, 0, 0);
    this.parallel = new THREE.Vector3(0, 0, 1);
  }

  getInteractiveObjects = (): THREE.Object3D[] => {
    return [...this.meshes];
  };
}
