
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
import { W as WebGLRenderer, S as Scene, P as PerspectiveCamera, G as GridHelper, M as Mesh, B as BoxGeometry, a as MeshNormalMaterial, t as threeFreeformControls, V as Vector3, b as SphereGeometry, R as RingGeometry, c as MeshBasicMaterial, D as DoubleSide } from '../three-freeform-controls-a54c2a0a.js';
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
const controls = controlsManager.anchor(box, {
  showHelperPlane: true
});
controls.showAll(false);

class CustomRotation extends threeFreeformControls.RotationGroup {
  constructor(color) {
    super();
    this.ball = new Mesh(
      new SphereGeometry(0.1, 32, 32),
      new MeshNormalMaterial()
    );
    this.ring = new Mesh(
      new RingGeometry(0.2, 0.3, 8),
      new MeshBasicMaterial({color, side: DoubleSide})
    );
    this.add(this.ball);
    this.add(this.ring);
  }

  getInteractiveObjects = () => {
    return [this.ball];
  };

  setColor = (color) => {
    this.ring.material.color.set(color);
  };
}

const customRotationHandle = new CustomRotation("yellow");
customRotationHandle.name = "Custom Rotation Handle";
customRotationHandle.position.set(0, 1.5, 0);
customRotationHandle.up = new Vector3(0, 0, 1);
controls.setupHandle(customRotationHandle);

// add label
const label = new _default("custom rotation handle (only ball is interactive)", 0.2);
label.position.set(0, -0.5, 0);
customRotationHandle.add(label);

// disable orbit controls while the freeform-controls are in use
controlsManager.listen(threeFreeformControls.EVENTS.DRAG_START, () => {
  orbitControls.enabled = false;
});
controlsManager.listen(threeFreeformControls.EVENTS.DRAG_STOP, () => {
  orbitControls.enabled = true;
});
