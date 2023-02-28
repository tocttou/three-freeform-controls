
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
import { W as WebGLRenderer, S as Scene, P as PerspectiveCamera, G as GridHelper, M as Mesh, B as BoxGeometry, a as MeshNormalMaterial, t as threeFreeformControls, Q as Quaternion } from '../three-freeform-controls-a54c2a0a.js';
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
const controls = controlsManager.anchor(box, {
  hideOtherHandlesOnDrag: false,
  showHelperPlane: true
});
controls.showAll(false);
controls.showByNames(
  [
    threeFreeformControls.DEFAULT_HANDLE_GROUP_NAME.YPT,
    threeFreeformControls.DEFAULT_HANDLE_GROUP_NAME.YNT,
    threeFreeformControls.DEFAULT_HANDLE_GROUP_NAME.YR,
    threeFreeformControls.DEFAULT_HANDLE_GROUP_NAME.PICK_PLANE_ZX,
  ],
  true
);

const quaternion = new Quaternion(-0.007, -0.776, 0.554, 0.301);

const rotationYLabel = new _default("rotated, pink handle (YR)", 0.3);
controls.rotationY.add(rotationYLabel);
controls.rotationY.setColor("pink");
rotationYLabel.position.y = 2;

const translationYPLabel = new _default("rotated handle (YPT)", 0.3);
controls.translationYP.add(translationYPLabel);
translationYPLabel.position.y = 3;

const translationYNLabel = new _default("translated handle (YNT)", 0.3);
controls.translationYN.add(translationYNLabel);
translationYNLabel.position.y = 2;

controls.rotationY.applyQuaternion(quaternion);
controls.rotationY.up.applyQuaternion(quaternion);

controls.translationYP.applyQuaternion(quaternion);
controls.translationYP.up.applyQuaternion(quaternion);
controls.translationYP.parallel.applyQuaternion(quaternion);

controls.translationYN.position.set(0, 0, 2);

// disable orbit controls while the freeform-controls are in use
controlsManager.listen(threeFreeformControls.EVENTS.DRAG_START, () => {
  orbitControls.enabled = false;
});
controlsManager.listen(threeFreeformControls.EVENTS.DRAG_STOP, () => {
  orbitControls.enabled = true;
});
