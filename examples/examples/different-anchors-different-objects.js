
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
import { W as WebGLRenderer, S as Scene, P as PerspectiveCamera, G as GridHelper, M as Mesh, B as BoxGeometry, a as MeshNormalMaterial, t as threeFreeformControls } from '../three-freeform-controls-a54c2a0a.js';
import { O as OrbitControls } from '../OrbitControls-44bb3693.js';
import { _ as _default } from '../three-spritetext-46e5738d.js';

// setup the scene
const renderer = new WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const scene = new Scene();
const camera = new PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
const orbitControls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 2, 8);
const gridHelper = new GridHelper(20, 20, 0x333333, 0x222222);
gridHelper.position.y -= 0.51;
scene.add(gridHelper);
const box1 = new Mesh(new BoxGeometry(1, 1, 1), new MeshNormalMaterial());
const box2 = new Mesh(box1.geometry.clone(), box1.material.clone());
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
const controlsManager = new threeFreeformControls.ControlsManager(camera, renderer.domElement);
scene.add(controlsManager);

// anchor controls to the box1
const controls1 = controlsManager.anchor(box1, {
  hideOtherHandlesOnDrag: false,
  hideOtherControlsInstancesOnDrag: false
});
const controls2 = controlsManager.anchor(box2, {
  hideOtherHandlesOnDrag: false,
  hideOtherControlsInstancesOnDrag: false,
  mode: threeFreeformControls.ANCHOR_MODE.INHERIT
});

const controls1Label = new _default("ANCHOR_MODE: FIXED", 0.3);
const controls2Label = new _default("ANCHOR_MODE: INHERIT", 0.3);
controls1Label.position.y = 3;
controls2Label.position.y = 3;
controls1.add(controls1Label);
controls2.add(controls2Label);

// disable orbit controls while the freeform-controls are in use
controlsManager.listen(threeFreeformControls.EVENTS.DRAG_START, () => {
  orbitControls.enabled = false;
});
controlsManager.listen(threeFreeformControls.EVENTS.DRAG_STOP, () => {
  orbitControls.enabled = true;
});
