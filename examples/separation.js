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
const box1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshNormalMaterial());
const box2 = new THREE.Mesh(box1.geometry.clone(), box1.material.clone());
box1.position.set(-5, 0, 0);
box2.position.set(5, 0, 0);
scene.add(box1);
scene.add(box2);

function animate() {
  requestAnimationFrame(animate);
  orbitControls.update();
  renderer.render(scene, camera);
}

animate();



// initialize three-freeform-controls
const controlsManager = new FreeformControls.ControlsManager(camera, renderer.domElement);
scene.add(controlsManager);

// anchor controls to the box1
const controls1 = controlsManager.anchor(box1, {
  separation: 0.75
});
const controls2 = controlsManager.anchor(box2, {
  separation: 1,
  rotationRadiusScale: 3
});

const controls1Label = new SpriteText("separation=0.75", 0.3);
const controls2Label = new SpriteText("separation=1, rotationRadiusScale=3", 0.3);
controls1Label.position.y = 3;
controls2Label.position.y = 3;
controls1.add(controls1Label);
controls2.add(controls2Label);

// disable orbit controls while the freeform-controls are in use
controlsManager.listen(FreeformControls.EVENTS.DRAG_START, () => {
  orbitControls.enabled = false;
});
controlsManager.listen(FreeformControls.EVENTS.DRAG_STOP, () => {
  orbitControls.enabled = true;
});
