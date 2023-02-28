
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
import { t as threeFreeformControls, V as Vector3, R as RingGeometry, e as MeshStandardMaterial, D as DoubleSide, M as Mesh, C as CylinderGeometry, f as ConeGeometry } from '../three-freeform-controls-a54c2a0a.js';

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
class Marker extends threeFreeformControls.ControlsManager {
    constructor(camera, domElement, minRingRadius, ringSize, arrowRadius, arrowLength) {
        super(camera, domElement);
        this.minRingRadius = minRingRadius;
        this.ringSize = ringSize;
        this.arrowRadius = arrowRadius;
        this.arrowLength = arrowLength;
        this.link = (object) => {
            const controls = this.anchor(object, {
                hideOtherHandlesOnDrag: true,
                hideOtherControlsInstancesOnDrag: false,
                highlightAxis: true,
                mode: threeFreeformControls.ANCHOR_MODE.INHERIT,
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
}
class RingFactory {
}
RingFactory.createRing = (minRadius, maxRadius, color) => {
    const sectors = 40;
    const geometry = new RingGeometry(minRadius, maxRadius, sectors);
    // Assign an index to each face, either 0 or 1, used to select a materials.
    const pattern = [0, 1, 1, 0];
    for (let i = 0; i < 2 * sectors; i++) {
        geometry.addGroup(3 * i, 3, pattern[i % 4]);
    }
    // Create the materials.
    const material = [
        new MeshStandardMaterial({
            color: color,
            side: DoubleSide,
        }),
        new MeshStandardMaterial({
            color: color,
            opacity: 0.5,
            transparent: true,
            side: DoubleSide,
        }),
    ];
    const meshes = [];
    meshes.push(new Mesh(geometry, material));
    return meshes;
};
/**
 * Create an arrow sitting on the origin and pointing in the direction of the y-axis.
 */
class ArrowFactory {
}
ArrowFactory.createArrow = (minRingRadius, arrowRadius, arrowLength, color) => {
    const radialSegments = 32;
    const material = new MeshStandardMaterial({ color: color });
    const meshes = [];
    meshes.push(new Mesh(new CylinderGeometry(arrowRadius, arrowRadius, arrowLength, radialSegments).translate(0, arrowLength / 2, 0), material));
    meshes.push(new Mesh(new ConeGeometry(2 * arrowRadius, 2 * arrowRadius, radialSegments).translate(0, arrowLength + arrowRadius, 0), material));
    return meshes;
};
/**
 * Handler to rotate the marker around the X axis.
 */
class XRotation extends threeFreeformControls.RotationGroup {
    constructor(minRingRadius, ringSize) {
        super();
        this.minRingRadius = minRingRadius;
        this.ringSize = ringSize;
        this.getInteractiveObjects = () => {
            return [...this.meshes];
        };
        this.up = new Vector3(1, 0, 0);
        this.meshes = [];
        const ring = RingFactory.createRing(minRingRadius, minRingRadius + ringSize, 0xff0000);
        ring.forEach((mesh) => {
            mesh.rotateOnAxis(new Vector3(0, 1, 0), Math.PI / 2);
        });
        this.meshes.push(...ring);
        this.add(...ring);
    }
    setColor(color) {
        throw new Error("Method not implemented.");
    }
}
/**
 * Handler to rotate the marker around the Y axis.
 */
class YRotation extends threeFreeformControls.RotationGroup {
    constructor(minRingRadius, ringSize) {
        super();
        this.minRingRadius = minRingRadius;
        this.ringSize = ringSize;
        this.getInteractiveObjects = () => {
            return [...this.meshes];
        };
        this.up = new Vector3(0, 1, 0);
        this.meshes = [];
        const ring = RingFactory.createRing(minRingRadius, minRingRadius + ringSize, 0x00ff00);
        ring.forEach((mesh) => {
            mesh.rotateOnAxis(new Vector3(1, 0, 0), Math.PI / 2);
        });
        this.meshes.push(...ring);
        this.add(...ring);
    }
    setColor(color) {
        throw new Error("Method not implemented.");
    }
}
/**
 * Handler to rotate the marker around the Z axis.
 */
class ZRotation extends threeFreeformControls.RotationGroup {
    constructor(minRingRadius, ringSize) {
        super();
        this.minRingRadius = minRingRadius;
        this.ringSize = ringSize;
        this.getInteractiveObjects = () => {
            return [...this.meshes];
        };
        this.meshes = [];
        this.up = new Vector3(0, 0, 1);
        const ring = RingFactory.createRing(minRingRadius, minRingRadius + ringSize, 0x0000ff);
        this.meshes.push(...ring);
        this.add(...ring);
    }
    setColor(color) {
        throw new Error("Method not implemented.");
    }
}
/**
 * Handler to translate the marker along the X axis.
 */
class XTranslation extends threeFreeformControls.TranslationGroup {
    constructor(minRingRadius, arrowRadius, arrowLength) {
        super();
        this.minRingRadius = minRingRadius;
        this.arrowRadius = arrowRadius;
        this.arrowLength = arrowLength;
        this.getInteractiveObjects = () => {
            return [...this.meshes];
        };
        this.up = new Vector3(0, 1, 0);
        this.parallel = new Vector3(1, 0, 0);
        this.meshes = [];
        const positiveArrow = ArrowFactory.createArrow(arrowRadius, arrowRadius, arrowLength, 0xff0000);
        positiveArrow.forEach((mesh) => {
            mesh.rotateOnAxis(new Vector3(0, 0, 1), -Math.PI / 2);
            mesh.translateOnAxis(new Vector3(0, 1, 0), minRingRadius);
        });
        this.meshes.push(...positiveArrow);
        this.add(...positiveArrow);
        const negativeArrow = ArrowFactory.createArrow(arrowRadius, arrowRadius, arrowLength, 0xff0000);
        negativeArrow.forEach((mesh) => {
            mesh.rotateOnAxis(new Vector3(0, 0, 1), Math.PI / 2);
            mesh.translateOnAxis(new Vector3(0, 1, 0), minRingRadius);
        });
        this.meshes.push(...negativeArrow);
        this.add(...negativeArrow);
    }
    setColor(color) {
        throw new Error("Method not implemented.");
    }
}
/**
 * Handler to translate the marker along the Y axis.
 */
class YTranslation extends threeFreeformControls.TranslationGroup {
    constructor(minRingRadius, arrowRadius, arrowLength) {
        super();
        this.minRingRadius = minRingRadius;
        this.arrowRadius = arrowRadius;
        this.arrowLength = arrowLength;
        this.getInteractiveObjects = () => {
            return [...this.meshes];
        };
        this.up = new Vector3(0, 0, 1);
        this.parallel = new Vector3(0, 1, 0);
        this.meshes = [];
        const positiveArrow = ArrowFactory.createArrow(arrowRadius, arrowRadius, arrowLength, 0x00ff00);
        positiveArrow.forEach((mesh) => {
            mesh.translateOnAxis(new Vector3(0, 1, 0), minRingRadius);
        });
        this.meshes.push(...positiveArrow);
        this.add(...positiveArrow);
        const negativeArrow = ArrowFactory.createArrow(arrowRadius, arrowRadius, arrowLength, 0x00ff00);
        negativeArrow.forEach((mesh) => {
            mesh.rotateOnAxis(new Vector3(0, 0, 1), Math.PI);
            mesh.translateOnAxis(new Vector3(0, 1, 0), minRingRadius);
        });
        this.meshes.push(...negativeArrow);
        this.add(...negativeArrow);
    }
    setColor(color) {
        throw new Error("Method not implemented.");
    }
}
/**
 * Handler to translate the marker along the Z axis.
 */
class ZTranslation extends threeFreeformControls.TranslationGroup {
    constructor(minRingRadius, arrowRadius, arrowLength) {
        super();
        this.minRingRadius = minRingRadius;
        this.arrowRadius = arrowRadius;
        this.arrowLength = arrowLength;
        this.getInteractiveObjects = () => {
            return [...this.meshes];
        };
        this.up = new Vector3(1, 0, 0);
        this.parallel = new Vector3(0, 0, 1);
        this.meshes = [];
        const positiveArrow = ArrowFactory.createArrow(arrowRadius, arrowRadius, arrowLength, 0x0000ff);
        positiveArrow.forEach((mesh) => {
            mesh.rotateOnAxis(new Vector3(1, 0, 0), Math.PI / 2);
            mesh.translateOnAxis(new Vector3(0, 1, 0), minRingRadius);
        });
        this.meshes.push(...positiveArrow);
        this.add(...positiveArrow);
        const negativeArrow = ArrowFactory.createArrow(arrowRadius, arrowRadius, arrowLength, 0x0000ff);
        negativeArrow.forEach((mesh) => {
            mesh.rotateOnAxis(new Vector3(1, 0, 0), -Math.PI / 2);
            mesh.translateOnAxis(new Vector3(0, 1, 0), minRingRadius);
        });
        this.meshes.push(...negativeArrow);
        this.add(...negativeArrow);
    }
    setColor(color) {
        throw new Error("Method not implemented.");
    }
}

export { Marker };
