
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
import { W as WebGLRenderer, S as Scene, P as PerspectiveCamera, G as GridHelper, M as Mesh, B as BoxGeometry, a as MeshNormalMaterial, t as threeFreeformControls, V as Vector3 } from '../three-freeform-controls-a54c2a0a.js';
import { O as OrbitControls } from '../OrbitControls-44bb3693.js';

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
camera.position.set(0, 2, 5);
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
const controls = controlsManager.anchor(box);
controls.showAll(false);

// create custom handles
const translationHandle = new threeFreeformControls.Translation("cyan");
const rotationHandle = new threeFreeformControls.Rotation("pink");

translationHandle.name = "TranslationHandle";
rotationHandle.name = "RotationHandle";

// modify the handles
translationHandle.rotateZ(-Math.PI / 2);

// modify the "up" vector to point perpendicular to the desired interaction plane of the object
translationHandle.up = new Vector3(0, 1, 0);
rotationHandle.up = new Vector3(0, 0, 1);

// only for handles of type "TranslationGroup",
// modify the "parallel" vector to point to the direction in which the handle is pointing
translationHandle.parallel = new Vector3(1, 0, 0);

// setupHandle
controls.setupHandle(translationHandle);
controls.setupHandle(rotationHandle);

// disable orbit controls while the freeform-controls are in use
controlsManager.listen(threeFreeformControls.EVENTS.DRAG_START, () => {
  orbitControls.enabled = false;
});
controlsManager.listen(threeFreeformControls.EVENTS.DRAG_STOP, () => {
  orbitControls.enabled = true;
});
