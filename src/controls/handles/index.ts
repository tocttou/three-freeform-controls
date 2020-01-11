import * as THREE from "three";

/**
 * Names for default handles
 */
export enum DEFAULT_HANDLE_GROUP_NAME {
  /**
   * name for default translation handle along the +ve x-axis
   */
  XPT = "xpt_handle",
  /**
   * name for default translation handle along the +ve y-axis
   */
  YPT = "ypt_handle",
  /**
   * name for default translation handle along the +ve z-axis
   */
  ZPT = "zpt_handle",
  /**
   * name for default translation handle along the -ve x-axis
   */
  XNT = "xnt_handle",
  /**
   * name for default translation handle along the -ve y-axis
   */
  YNT = "ynt_handle",
  /**
   * name for default translation handle along the -ve z-axis
   */
  ZNT = "znt_handle",
  /**
   * name for default rotation handle along the x-axis
   */
  XR = "xr_handle",
  /**
   * name for default rotation handle along the y-axis
   */
  YR = "yr_handle",
  /**
   * name for default rotation handle along the z-axis
   */
  ZR = "zr_handle",
  /**
   * name for default rotation handle in the eye-plane
   */
  ER = "er_handle",
  /**
   * name for default translation handle in the eye-plane
   */
  PICK = "pick_handle",
  /**
   * name for default translation handle in the xy plane
   */
  PICK_PLANE_XY = "pick_plane_xy_handle",
  /**
   * name for default translation handle in the yz plane
   */
  PICK_PLANE_YZ = "pick_plane_yz_handle",
  /**
   * name for default translation handle in the zx plane
   */
  PICK_PLANE_ZX = "pick_plane_zx_handle"
}

/**
 * Base class for all handles
 */
export abstract class HandleGroup extends THREE.Group {
  /**
   * returns an array of all the interactive objects that form a handle;
   * note that a handle can have non-interactive objects as well.
   */
  public abstract getInteractiveObjects(): THREE.Mesh[];

  /**
   * sets the color for the handle; this may involve setting colors for multiple
   * constituent meshes that form the handle (interactive or non-interactive)
   * @param color - hex code for the color
   */
  public abstract setColor(color: string): void;
}

/**
 * This class can be extended to create custom translation handles.
 * It requires setting the properties `parallel` and `up`.
 * Requires implementing [[HandleGroup.getInteractiveObjects]] and
 * [[HandleGroup.setColor]].
 */
export abstract class TranslationGroup extends HandleGroup {
  /**
   * This is a unit vector that runs parallel to the direction of the translation handle.
   * For example, in case of [[Controls.translationXP]], it is
   * `THREE.Vector3(1,0,0)` (along the x-axis).
   */
  public abstract parallel: THREE.Vector3;
  /**
   * This is a unit vector that runs perpendicular to the direction of the translation handles.
   * For example, in case of [[Controls.translationXP]], it is
   * `THREE.Vector3(0,1,0)` (along the y-axis).
   */
  public up = new THREE.Vector3();
}

/**
 * This class can be extended to create custom rotation handles.
 * It requires setting the property `up`.
 * Requires implementing [[HandleGroup.getInteractiveObjects]] and
 * [[HandleGroup.setColor]].
 */
export abstract class RotationGroup extends HandleGroup {
  /**
   * This is a unit vector that runs along the axis of the rotation handles.
   * For example, in case of [[Controls.rotationX]], it is
   * `THREE.Vector3(1,0,0)` (along the x-axis).
   */
  public up = new THREE.Vector3();
}

/**
 * This class can be extended to create custom pick handle (translates in eye-plane).
 * Requires implementing [[HandleGroup.getInteractiveObjects]] and
 * [[HandleGroup.setColor]].
 */
export abstract class PickGroup extends HandleGroup {}

/**
 * This class can be extended to create custom pick plane handles.
 * It requires setting the property `up`.
 * Requires implementing [[HandleGroup.getInteractiveObjects]] and
 * [[HandleGroup.setColor]].
 */
export abstract class PickPlaneGroup extends HandleGroup {
  /**
   * This is a unit vector that is perpendicular to the plane handles.
   * For example, in case of [[Controls.pickPlaneXY]], it is
   * `THREE.Vector3(0,0,1)` (along the z-axis).
   */
  public up = new THREE.Vector3();
}

export type IHandle = RotationGroup | TranslationGroup | PickGroup | PickPlaneGroup;
