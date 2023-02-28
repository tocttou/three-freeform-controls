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
camera.position.set(0, 2, 8);
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
const controlsFixed = controlsManager.anchor(box, {
  hideOtherHandlesOnDrag: false,
  hideOtherControlsInstancesOnDrag: false
});
controlsFixed.showAll(false);
controlsFixed.showByNames([
  FreeformControls.DEFAULT_HANDLE_GROUP_NAME.ZPT,
  FreeformControls.DEFAULT_HANDLE_GROUP_NAME.ZNT,
  FreeformControls.DEFAULT_HANDLE_GROUP_NAME.ZR
], true);

const controlsInherit = controlsManager.anchor(box, {
  mode: FreeformControls.ANCHOR_MODE.INHERIT,
  hideOtherHandlesOnDrag: false,
  hideOtherControlsInstancesOnDrag: false,
});
controlsInherit.showAll(false);
controlsInherit.showByNames([
  FreeformControls.DEFAULT_HANDLE_GROUP_NAME.XPT,
  FreeformControls.DEFAULT_HANDLE_GROUP_NAME.XNT,
  FreeformControls.DEFAULT_HANDLE_GROUP_NAME.XR
], true);

// add labels
const fixedLabel = new SpriteText("ANCHOR_MODE: FIXED (BLUE)", 0.2);
const inheritLabel = new SpriteText("ANCHOR_MODE: INHERIT (RED)", 0.2);
fixedLabel.position.z = 3;
inheritLabel.position.x = 4;
controlsFixed.add(fixedLabel);
controlsInherit.add(inheritLabel);

// disable orbit controls while the freeform-controls are in use
controlsManager.listen(FreeformControls.EVENTS.DRAG_START, () => {
  orbitControls.enabled = false;
});
controlsManager.listen(FreeformControls.EVENTS.DRAG_STOP, () => {
  orbitControls.enabled = true;
});
