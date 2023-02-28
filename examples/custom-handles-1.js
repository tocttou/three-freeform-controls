import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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
const controls = controlsManager.anchor(box);
controls.showAll(false);

// create custom handles
const translationHandle = new FreeformControls.Translation("cyan");
const rotationHandle = new FreeformControls.Rotation("pink");

translationHandle.name = "TranslationHandle";
rotationHandle.name = "RotationHandle";

// modify the handles
translationHandle.rotateZ(-Math.PI / 2);

// modify the "up" vector to point perpendicular to the desired interaction plane of the object
translationHandle.up = new THREE.Vector3(0, 1, 0);
rotationHandle.up = new THREE.Vector3(0, 0, 1);

// only for handles of type "TranslationGroup",
// modify the "parallel" vector to point to the direction in which the handle is pointing
translationHandle.parallel = new THREE.Vector3(1, 0, 0);

// setupHandle
controls.setupHandle(translationHandle);
controls.setupHandle(rotationHandle);

// disable orbit controls while the freeform-controls are in use
controlsManager.listen(FreeformControls.EVENTS.DRAG_START, () => {
  orbitControls.enabled = false;
});
controlsManager.listen(FreeformControls.EVENTS.DRAG_STOP, () => {
  orbitControls.enabled = true;
});
