import * as THREE from "three";

export default abstract class ControlsGroup extends THREE.Group {
  public abstract getInteractiveObjects(): THREE.Object3D[];
}
