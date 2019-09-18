import * as THREE from "three";

export abstract class HandleGroup extends THREE.Group {
  public abstract getInteractiveObjects(): THREE.Mesh[];
  public abstract setColor(color: string): void;
}

export abstract class TranslationGroup extends HandleGroup {
  public abstract parallel: THREE.Vector3;
}

export abstract class RotationGroup extends HandleGroup {}

export abstract class PickGroup extends HandleGroup {}

export abstract class PickPlaneGroup extends HandleGroup {}

export type IHandle = RotationGroup | TranslationGroup | PickGroup | PickPlaneGroup;
