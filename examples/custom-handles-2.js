import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import SpriteText from "three-spritetext";

import * as FreeformControls from "../";
// setup the scene
const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
const orbitControls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 2, 5);
const gridHelper = new THREE.GridHelper(20, 20, 0x333333, 0x222222);
gridHelper.position.y -= 0.51;
scene.add(gridHelper);
const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshNormalMaterial());
scene.add(box);

function animate() {
  requestAnimationFrame(animate);
  orbitControls.update();
  renderer.render(scene, camera);
}

animate();



// initialize three-freeform-controls
const controlsManager = new FreeformControls.ControlsManager(camera, renderer.domElement);
scene.add(controlsManager);

// anchor controls to the box
const controls = controlsManager.anchor(box, {
  showHelperPlane: true
});
controls.showAll(false);

class CustomRotation extends FreeformControls.RotationGroup {
  constructor(color) {
    super();
    this.ball = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 32, 32),
      new THREE.MeshNormalMaterial()
    );
    this.ring = new THREE.Mesh(
      new THREE.RingGeometry(0.2, 0.3, 8),
      new THREE.MeshBasicMaterial({color, side: THREE.DoubleSide})
    );
    this.add(this.ball);
    this.add(this.ring);
  }

  getInteractiveObjects = () => {
    return [this.ball];
  };

  setColor = (color) => {
    this.ring.material.color.set(color);
  };
}

const customRotationHandle = new CustomRotation("yellow");
customRotationHandle.name = "Custom Rotation Handle";
customRotationHandle.position.set(0, 1.5, 0);
customRotationHandle.up = new THREE.Vector3(0, 0, 1);
controls.setupHandle(customRotationHandle);

// add label
const label = new SpriteText("custom rotation handle (only ball is interactive)", 0.2);
label.position.set(0, -0.5, 0);
customRotationHandle.add(label);

// disable orbit controls while the freeform-controls are in use
controlsManager.listen(FreeformControls.EVENTS.DRAG_START, () => {
  orbitControls.enabled = false;
});
controlsManager.listen(FreeformControls.EVENTS.DRAG_STOP, () => {
  orbitControls.enabled = true;
});
