import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import * as FreeformControls from "../dist/three-freeform-controls.js";

import { Marker } from "./marker";

// setup the scene
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);

const orbitControls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 2, 5);
const gridHelper = new THREE.GridHelper(20, 20, 0x3a3a3a, 0x3a3a3a);
gridHelper.position.y -= 0.51;
scene.add(gridHelper);
// const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshNormalMaterial());
// scene.add(box);

const animate = () => {
  requestAnimationFrame(animate);
  orbitControls.update();
  renderer.render(scene, camera);
};

animate();

const marker1 = new Marker(1.4, 0.6, 0.2, 1.2);
marker1.translateOnAxis(new THREE.Vector3(1, 0, 0), 0);
scene.add(marker1);

const marker2 = new Marker(0.6, 0.6, 0.2, 2.4);
marker2.translateOnAxis(new THREE.Vector3(1, 0, 0), 5);
marker2.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 4);
marker2.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 4);
marker2.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 4);
scene.add(marker2);

const marker3 = new Marker(1, 0.6, 0.2, 0.6);
marker3.translateOnAxis(new THREE.Vector3(1, 0, 0), -5);
marker3.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
marker3.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 3);
marker3.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 3);
scene.add(marker3);

// three-freeform-controls

// initialize three-freeform-controls
const controlsManager = new FreeformControls.ControlsManager(camera, renderer.domElement);
//scene.add(controlsManager);

// anchor controls to the box
//const controls = controlsManager.anchor(box, {});

// disable orbit controls while the freeform-controls are in use
controlsManager.listen(FreeformControls.EVENTS.DRAG_START, () => {
  orbitControls.enabled = false;
});
controlsManager.listen(FreeformControls.EVENTS.DRAG_STOP, () => {
  orbitControls.enabled = true;
});
