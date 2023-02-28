
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
import { W as WebGLRenderer, S as Scene, P as PerspectiveCamera, A as AmbientLight, d as DirectionalLight, G as GridHelper, M as Mesh, B as BoxGeometry, a as MeshNormalMaterial, V as Vector3, t as threeFreeformControls } from '../three-freeform-controls-a54c2a0a.js';
import { O as OrbitControls } from '../OrbitControls-44bb3693.js';
import { Marker } from './marker.js';

// setup the scene
const renderer = new WebGLRenderer({
    antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const scene = new Scene();
const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
const ambientLight = new AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);
const orbitControls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 2, 12);
const gridHelper = new GridHelper(20, 20, 0x3a3a3a, 0x3a3a3a);
gridHelper.position.y -= 0.51;
scene.add(gridHelper);
const animate = () => {
    requestAnimationFrame(animate);
    orbitControls.update();
    renderer.render(scene, camera);
};
animate();
// Marker 1
const box1 = new Mesh(new BoxGeometry(1, 1, 1), new MeshNormalMaterial());
box1.translateOnAxis(new Vector3(1, 0, 0), 4);
scene.add(box1);
const marker1 = new Marker(camera, renderer.domElement, 1.4, 0.6, 0.2, 1.2);
marker1.link(box1);
marker1.listen(threeFreeformControls.EVENTS.DRAG_START, () => {
    orbitControls.enabled = false;
});
marker1.listen(threeFreeformControls.EVENTS.DRAG_STOP, () => {
    orbitControls.enabled = true;
});
scene.add(marker1);
// Marker 2
const box2 = new Mesh(new BoxGeometry(1, 1, 1), new MeshNormalMaterial());
box2.translateOnAxis(new Vector3(1, 0, 0), -4);
scene.add(box2);
const marker2 = new Marker(camera, renderer.domElement, 0.7, 0.6, 0.2, 2);
marker2.link(box2);
marker2.listen(threeFreeformControls.EVENTS.DRAG_START, () => {
    orbitControls.enabled = false;
});
marker2.listen(threeFreeformControls.EVENTS.DRAG_STOP, () => {
    orbitControls.enabled = true;
});
scene.add(marker2);
