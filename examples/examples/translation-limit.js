
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
import { W as WebGLRenderer, S as Scene, P as PerspectiveCamera, G as GridHelper, M as Mesh, B as BoxGeometry, a as MeshNormalMaterial, b as SphereGeometry, c as MeshBasicMaterial, t as threeFreeformControls } from '../three-freeform-controls-a54c2a0a.js';
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
const ball = new Mesh(new SphereGeometry(0.1, 32, 32), new MeshBasicMaterial({
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
const controlsManager = new threeFreeformControls.ControlsManager(camera, renderer.domElement);
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
  threeFreeformControls.DEFAULT_HANDLE_GROUP_NAME.XR,
  threeFreeformControls.DEFAULT_HANDLE_GROUP_NAME.YR,
  threeFreeformControls.DEFAULT_HANDLE_GROUP_NAME.ZR,
  threeFreeformControls.DEFAULT_HANDLE_GROUP_NAME.ER
], false);

const xHandleLabel = new _default("xlimit: [-2, 2]", 0.3);
const yHandleLabel = new _default("ylimit: [-2, 2]", 0.3);
const zHandleLabel = new _default("zlimit: [-2, 2]", 0.3);
xHandleLabel.position.x = 3;
yHandleLabel.position.y = 3;
zHandleLabel.position.z = 3;
controls.add(xHandleLabel);
controls.add(yHandleLabel);
controls.add(zHandleLabel);

// disable orbit controls while the freeform-controls are in use
controlsManager.listen(threeFreeformControls.EVENTS.DRAG_START, () => {
  orbitControls.enabled = false;
});
controlsManager.listen(threeFreeformControls.EVENTS.DRAG_STOP, () => {
  orbitControls.enabled = true;
});
