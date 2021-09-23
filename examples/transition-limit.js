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
const ball = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32), new THREE.MeshBasicMaterial({
  color: 'yellow'
}));
ball.position.y = -0.51;
scene.add(ball);
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
  snapTranslation: {
    x: true,
    y: false,
    z: true
  }
});
controls.setTranslationLimit({
  x: [-2, 2],
  y: [-2, 2],
  z: [-2, 2]
});
controls.showByNames([
  FreeformControls.DEFAULT_HANDLE_GROUP_NAME.XR,
  FreeformControls.DEFAULT_HANDLE_GROUP_NAME.YR,
  FreeformControls.DEFAULT_HANDLE_GROUP_NAME.ZR,
  FreeformControls.DEFAULT_HANDLE_GROUP_NAME.ER
], false);

const xHandleLabel = new SpriteText("xlimit: [-2, 2]", 0.3);
const yHandleLabel = new SpriteText("ylimit: [-2, 2]", 0.3);
const zHandleLabel = new SpriteText("zlimit: [-2, 2]", 0.3);
xHandleLabel.position.x = 3;
yHandleLabel.position.y = 3;
zHandleLabel.position.z = 3;
controls.add(xHandleLabel);
controls.add(yHandleLabel);
controls.add(zHandleLabel);

// disable orbit controls while the freeform-controls are in use
controlsManager.listen(FreeformControls.EVENTS.DRAG_START, () => {
  orbitControls.enabled = false;
});
controlsManager.listen(FreeformControls.EVENTS.DRAG_STOP, () => {
  orbitControls.enabled = true;
});
