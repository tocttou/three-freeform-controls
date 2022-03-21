import * as THREE from "three";
import { Vector3 } from "three";
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
camera.position.set(0, 2, 12);
const gridHelper = new THREE.GridHelper(20, 20, 0x3a3a3a, 0x3a3a3a);
gridHelper.position.y -= 0.51;
scene.add(gridHelper);

const animate = () => {
  requestAnimationFrame(animate);
  orbitControls.update();
  renderer.render(scene, camera);
};

animate();

// Marker 1

const box1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshNormalMaterial());
box1.translateOnAxis(new Vector3(1, 0, 0), 4);
scene.add(box1);

const marker1 = new Marker(camera, renderer.domElement, 1.4, 0.6, 0.2, 1.2);
marker1.link(box1);
marker1.listen(FreeformControls.EVENTS.DRAG_START, () => {
  orbitControls.enabled = false;
});
marker1.listen(FreeformControls.EVENTS.DRAG_STOP, () => {
  orbitControls.enabled = true;
});

scene.add(marker1);

// Marker 2

const box2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshNormalMaterial());
box2.translateOnAxis(new Vector3(1, 0, 0), -4);
scene.add(box2);

const marker2 = new Marker(camera, renderer.domElement, 0.7, 0.6, 0.2, 2);
marker2.link(box2);
marker1.listen(FreeformControls.EVENTS.DRAG_START, () => {
  orbitControls.enabled = false;
});
marker2.listen(FreeformControls.EVENTS.DRAG_STOP, () => {
  orbitControls.enabled = true;
});

scene.add(marker2);
