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
const label = new SpriteText("check console", 0.3);
box.add(label);
label.position.y = 3;

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

// disable orbit controls while the freeform-controls are in use
controlsManager.listen(FreeformControls.EVENTS.DRAG_START, (_, handleName) => {
  orbitControls.enabled = false;
  console.log(`DRAG_START: ${handleName}`);
});
controlsManager.listen(FreeformControls.EVENTS.DRAG, (_, handleName) => {
  console.log(`DRAG: ${handleName}`);
});
controlsManager.listen(FreeformControls.EVENTS.DRAG_STOP, (_, handleName) => {
  orbitControls.enabled = true;
  console.log(`DRAG_START: ${handleName}`);
});
