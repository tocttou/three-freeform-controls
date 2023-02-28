
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
const box = new Mesh(new BoxGeometry(1, 1, 1), new MeshNormalMaterial());
scene.add(box);

function animate() {
  requestAnimationFrame(animate);
  orbitControls.update();
  renderer.render(scene, camera);
}

animate();



// initialize three-freeform-controls
const controlsManager = new threeFreeformControls.ControlsManager(camera, renderer.domElement);
scene.add(controlsManager);

// anchor controls to the box
const controlsFixed = controlsManager.anchor(box, {
  hideOtherHandlesOnDrag: false,
  hideOtherControlsInstancesOnDrag: false
});
controlsFixed.showAll(false);
controlsFixed.showByNames([
  threeFreeformControls.DEFAULT_HANDLE_GROUP_NAME.ZPT,
  threeFreeformControls.DEFAULT_HANDLE_GROUP_NAME.ZNT,
  threeFreeformControls.DEFAULT_HANDLE_GROUP_NAME.ZR
], true);

const controlsInherit = controlsManager.anchor(box, {
  mode: threeFreeformControls.ANCHOR_MODE.INHERIT,
  hideOtherHandlesOnDrag: false,
  hideOtherControlsInstancesOnDrag: false,
});
controlsInherit.showAll(false);
controlsInherit.showByNames([
  threeFreeformControls.DEFAULT_HANDLE_GROUP_NAME.XPT,
  threeFreeformControls.DEFAULT_HANDLE_GROUP_NAME.XNT,
  threeFreeformControls.DEFAULT_HANDLE_GROUP_NAME.XR
], true);

// add labels
const fixedLabel = new _default("ANCHOR_MODE: FIXED (BLUE)", 0.2);
const inheritLabel = new _default("ANCHOR_MODE: INHERIT (RED)", 0.2);
fixedLabel.position.z = 3;
inheritLabel.position.x = 4;
controlsFixed.add(fixedLabel);
controlsInherit.add(inheritLabel);

// disable orbit controls while the freeform-controls are in use
controlsManager.listen(threeFreeformControls.EVENTS.DRAG_START, () => {
  orbitControls.enabled = false;
});
controlsManager.listen(threeFreeformControls.EVENTS.DRAG_STOP, () => {
  orbitControls.enabled = true;
});
