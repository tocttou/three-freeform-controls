import * as THREE from "three";

interface IRingOptions {
  color?: number;
}

export class Ring extends THREE.Mesh {
  private color: number;

  constructor(private minRadius: number, private maxRadius: number, options?: IRingOptions) {
    super();

    this.color = options?.color ?? 0xffffff;
    this.geometry = new THREE.BufferGeometry();

    const sectors = 40;

    // Create vertices.
    const positions = [];
    for (let i = 0; i < sectors; i++) {
      const vertex1 = [
        0,
        this.minRadius * Math.cos((2 * Math.PI * i) / sectors),
        this.minRadius * Math.sin((2 * Math.PI * i) / sectors),
      ];
      const vertex2 = [
        0,
        this.maxRadius * Math.cos((2 * Math.PI * i) / sectors),
        this.maxRadius * Math.sin((2 * Math.PI * i) / sectors),
      ];
      positions.push(...vertex1);
      positions.push(...vertex2);
    }

    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(positions), 3)
    );

    // Create faces.
    const indexes = [];
    for (let i = 0; i < sectors; i++) {
      const index1 = [
        (2 * i) % (2 * sectors),
        (2 * i + 1) % (2 * sectors),
        (2 * i + 3) % (2 * sectors),
      ];
      const index2 = [
        (2 * i) % (2 * sectors),
        (2 * i + 3) % (2 * sectors),
        (2 * i + 2) % (2 * sectors),
      ];
      indexes.push(...index1);
      indexes.push(...index2);
    }

    this.geometry.setIndex(indexes);
    this.geometry.computeVertexNormals();
    this.geometry.clearGroups();

    const pattern = [0, 1, 1, 0];
    for (let i = 0; i < 2 * sectors; i++) {
      this.geometry.addGroup(3 * i, 3, pattern[i % 4]);
    }

    // Assign materials.
    const material1 = new THREE.MeshStandardMaterial({
      color: this.color,
      side: THREE.DoubleSide,
    });
    const material2 = new THREE.MeshStandardMaterial({
      color: this.color,
      opacity: 0.5,
      transparent: true,
      side: THREE.DoubleSide,
    });

    this.material = [material1, material2];
  }
}

interface IArrowOptions {
  color?: number;
}

export class Arrow extends THREE.Group {
  private color: number;

  constructor(private radius: number, private length: number, options?: IArrowOptions) {
    super();

    this.color = options?.color ?? 0xffffff;

    const radialSegments = 32;
    const arrowScale = 2;

    const cylinderGeometry = new THREE.CylinderGeometry(radius, radius, length, radialSegments);
    const cylimnderMaterial = new THREE.MeshStandardMaterial({ color: this.color });
    const cylinder = new THREE.Mesh(cylinderGeometry, cylimnderMaterial);
    this.add(cylinder);

    const coneGeometry = new THREE.ConeGeometry(
      arrowScale * radius,
      arrowScale * radius,
      radialSegments
    );
    const coneMaterial = new THREE.MeshStandardMaterial({ color: this.color });

    const cone = new THREE.Mesh(coneGeometry, coneMaterial);
    cone.translateOnAxis(new THREE.Vector3(0, 1, 0), length / 2);
    this.add(cone);
  }
}

export class Marker extends THREE.Group {
  constructor() {
    super();

    const minRingRadius = 1.4;
    const maxRingRadius = 2;

    const arrowRadius = 0.2;
    const arrowLength = 3 * (maxRingRadius - minRingRadius);

    const xRing = new Ring(minRingRadius, maxRingRadius, { color: 0xff0000 });
    this.add(xRing);

    const yRing = new Ring(minRingRadius, maxRingRadius, { color: 0x00ff00 });
    yRing.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 2);
    this.add(yRing);

    const zRing = new Ring(minRingRadius, maxRingRadius, { color: 0x0000ff });
    zRing.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
    this.add(zRing);

    const xAxisPositive = new Arrow(arrowRadius, arrowLength, { color: 0xff0000 });
    xAxisPositive.rotateOnAxis(new THREE.Vector3(0, 0, 1), -Math.PI / 2);
    xAxisPositive.translateOnAxis(new THREE.Vector3(0, 1, 0), minRingRadius + arrowLength / 2);
    this.add(xAxisPositive);

    const xAxisNegative = new Arrow(arrowRadius, arrowLength, { color: 0xff0000 });
    xAxisNegative.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 2);
    xAxisNegative.translateOnAxis(new THREE.Vector3(0, 1, 0), minRingRadius + arrowLength / 2);
    this.add(xAxisNegative);

    const yAxisPositive = new Arrow(arrowRadius, arrowLength, { color: 0x00ff00 });
    yAxisPositive.rotateOnAxis(new THREE.Vector3(1, 0, 0), 0);
    yAxisPositive.translateOnAxis(new THREE.Vector3(0, 1, 0), minRingRadius + arrowLength / 2);
    this.add(yAxisPositive);

    const yAxisNegative = new Arrow(arrowRadius, arrowLength, { color: 0x00ff00 });
    yAxisNegative.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI);
    yAxisNegative.translateOnAxis(new THREE.Vector3(0, 1, 0), minRingRadius + arrowLength / 2);
    this.add(yAxisNegative);

    const zAxisPositive = new Arrow(arrowRadius, arrowLength, { color: 0x0000ff });
    zAxisPositive.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    zAxisPositive.translateOnAxis(new THREE.Vector3(0, 1, 0), minRingRadius + arrowLength / 2);
    this.add(zAxisPositive);

    const zAxisNegative = new Arrow(arrowRadius, arrowLength, { color: 0x0000ff });
    zAxisNegative.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
    zAxisNegative.translateOnAxis(new THREE.Vector3(0, 1, 0), minRingRadius + arrowLength / 2);
    this.add(zAxisNegative);
  }
}
