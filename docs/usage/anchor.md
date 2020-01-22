---
layout: default
title: Anchor
nav_order: 2
parent: Usage
---

The `FreeformControls.ControlsManager` instance is used to anchor the controls onto objects.

```js
const controlsManager = new FreeformControls.ControlsManager(camera, renderer.domElement);
scene.add(controlsManager);
```

## [anchor ![link](https://img.icons8.com/ios/24/000000/external-link.png){: .link-icon }]({{ site.baseurl }}/apiref/classes/controlsmanager.html#anchor){:target="_blank"}

Then calling `anchor` on the `controlsManager` gives access to the controls object:

```js
// box: THREE.Object3d
const controls = controlsManager.anchor(box);
```

### Options

All options accepted by `anchor` are listed below:

| key                                | default value                                            | description                                                                                                                                                                                                                                                                                                                                      |
| :--------------------------------- | :------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| mode                               | `ANCHOR_MODE.FIXED`                                      | Controls can be anchored in two modes: 1. `FIXED`: The controls retain their orientation with respect to the world even if the object (or an object up its parent chain) is rotating. 2. `INHERIT`: The controls inherit the orientation of the object the controls object is anchored to.                                                       |
| orientation                        | `{ x: 0, y: 0, z: 0, w: 1 }`                             | The initial orientation (in quaternion form) of the controls object.                                                                                                                                                                                                                                                                             |
| hideOtherHandlesOnDrag             | `true`                                                   | Hide all other handles of the controls object while being interacted with.                                                                                                                                                                                                                                                                       |
| hideOtherControlsInstancesOnDrag   | `true`                                                   | Hide all other controls objects from the scene when being interacted with.                                                                                                                                                                                                                                                                       |
| isDampingEnabled                   | `true`                                                   | Enables damping for the controls                                                                                                                                                                                                                                                                                                                 |
| showHelperPlane                    | `false`                                                  | Useful for debug. Shows the intersection plane used in raycasting.                                                                                                                                                                                                                                                                               |
| useComputedBounds                  | `false`                                                  | Uses `THREE.Mesh.computeBounds` to set the separation; if separation is provided in addition to this option, it is added to the computed bounds. [View example]({{ site.baseurl }}/examples/computed-bounds){:target="_blank"}{: .btn .fs-5 .mb-4 .mb-md-0 .inherit-display }                                                                    |
| translationDistanceScale           | `1.0`                                                    | Sets the scaling for distance between translation handles' base and the center of the controls.                                                                                                                                                                                                                                                  |
| rotationRadiusScale                | `1.0`                                                    | Sets the scaling factor for the radius of rotation handles.                                                                                                                                                                                                                                                                                      |
| eyeRotationRadiusScale             | `1.25`                                                   | Sets the scaling factor for the radius of rotation handles in eye plane.                                                                                                                                                                                                                                                                         |
| pickPlaneSizeScale                 | `0.75`                                                   | Sets the width and height scale for the pick plane handles.                                                                                                                                                                                                                                                                                      |
| separation                         | `0.5`                                                    | The distance between the position of the object and the position of the handles (in case of translation handles), or the radius (in case of rotation handles), or the size of the plane (in case of plane handles. [View example]({{ site.baseurl }}/examples/separation){:target="_blank"}{: .btn .fs-5 .mb-4 .mb-md-0 .inherit-display }       |
| highlightAxis                      | `true`                                                   | For translation handles: highlights the axis along which the object moves. For rotation handles: highlights the axis of rotation. Not available on other handles                                                                                                                                                                                 |
| snapTranslation                    | `{ x: false, y: false, z: false }`                       | Enables snap to grid (nearest integer coordinate) for all translation type handles: TranslationGroup, PickGroup, and PickPlaneGroup. [View example]({{ site.baseurl }}/examples/snap){:target="_blank"}{: .btn .fs-5 .mb-4 .mb-md-0 .inherit-display }                                                                                           |

The options can be specified as:

```js
// box: THREE.Object3d
import { ANCHOR_MODE } from "three-freeform-controls";
const controls = controlsManager.anchor(box, {
  mode: ANCHOR_MODE.FIXED, // or ANCHOR_MODE.INHERIT
  separation: 0.5,
  orientation: {
    x: 0,
    y: 0,
    z: 0,
    w: 1
  },
  hideOtherHandlesOnDrag: true,
  hideOtherControlsInstancesOnDrag: true,
  showHelperPlane: false
});
```

### Different anchors on different objects

The `controlsManager` can be used to anchor the controls on more than one object as well.
An example illustrating the different anchor modes on different objects can be accessed below.

[View example]({{ site.baseurl }}/examples/different-anchors-different-objects){:target="_blank"}{: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }

### Different anchors on the same object

Sometimes it is necessary to have some controls handles behave differently (or perhaps at different orientation) than others. In that case the `controlsManager` can be used to anchor different partial controls on the same object.
More on partial controls in [Partial Controls]({{ site.baseurl }}/docs/usage/partial-controls).

An example illustrating different anchor modes for multiple partial controls on the same object can be accessed below.

[View example]({{ site.baseurl }}/examples/different-anchors-same-object){:target="_blank"}{: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }

## [detach ![link](https://img.icons8.com/ios/24/000000/external-link.png){: .link-icon }]({{ site.baseurl }}/apiref/classes/controlsmanager.html#detach){:target="_blank"}

The anchored controls can be detached like this:

```js
controlsManager.detach(object, controls);
```

## [destroy ![link](https://img.icons8.com/ios/24/000000/external-link.png){: .link-icon }]({{ site.baseurl }}/apiref/classes/controlsmanager.html#destroy){:target="_blank"}

All anchored controls instances can be removed like this:

```js
controlsManager.destroy();
```

Next section: [Events]({{ site.baseurl }}/docs/usage/events)
