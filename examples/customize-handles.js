import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import SpriteText from "three-spritetext";

import * as FreeformControls from "../dist/three-freeform-controls.js";
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
const controls = controlsManager.anchor(box, {
  hideOtherHandlesOnDrag: false,
  showHelperPlane: true
});
controls.showAll(false);
controls.showByNames(
  [
    FreeformControls.DEFAULT_HANDLE_GROUP_NAME.YPT,
    FreeformControls.DEFAULT_HANDLE_GROUP_NAME.YNT,
    FreeformControls.DEFAULT_HANDLE_GROUP_NAME.YR,
    FreeformControls.DEFAULT_HANDLE_GROUP_NAME.PICK_PLANE_ZX,
  ],
  true
);

const quaternion = new THREE.Quaternion(-0.007, -0.776, 0.554, 0.301);

const rotationYLabel = new SpriteText("rotated, pink handle (YR)", 0.3);
controls.rotationY.add(rotationYLabel);
controls.rotationY.setColor("pink");
rotationYLabel.position.y = 2;

const translationYPLabel = new SpriteText("rotated handle (YPT)", 0.3);
controls.translationYP.add(translationYPLabel);
translationYPLabel.position.y = 3;

const translationYNLabel = new SpriteText("translated handle (YNT)", 0.3);
controls.translationYN.add(translationYNLabel);
translationYNLabel.position.y = 2;

controls.rotationY.applyQuaternion(quaternion);
controls.rotationY.up.applyQuaternion(quaternion);

controls.translationYP.applyQuaternion(quaternion);
controls.translationYP.up.applyQuaternion(quaternion);
controls.translationYP.parallel.applyQuaternion(quaternion);

controls.translationYN.position.set(0, 0, 2);

// disable orbit controls while the freeform-controls are in use
controlsManager.listen(FreeformControls.EVENTS.DRAG_START, () => {
  orbitControls.enabled = false;
});
controlsManager.listen(FreeformControls.EVENTS.DRAG_STOP, () => {
  orbitControls.enabled = true;
});
