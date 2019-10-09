---
layout: default
title: Anchor
nav_order: 2
parent: Usage
---

The `FreeformControls.ControlsManager` instance is used to anchor the controls onto objects.

```js
const controlsManager = new FreeformControls.ControlsManager(
  camera,
  renderer.domElement
);
scene.add(controlsManager);
```

## anchor

Then calling `anchor` on the `controlsManager` gives access to the controls object:

```js
// box: THREE.Object3d
const controls = controlsManager.anchor(box);
```

### Options

All options accepted by `anchor` are listed below:

| key                                | default value                | description                                                                                                                                                                                                                                                                                |
|:-----------------------------------|:-----------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| mode                               | `ANCHOR_MODE.FIXED`          | Controls can be anchored in two modes: 1. `FIXED`: The controls retain their orientation with respect to the world even if the object (or an object up its parent chain) is rotating. 2. `INHERIT`: The controls inherit the orientation of the object the controls object is anchored to. |
| separationT                        | `{ x: 1, y: 1, z: 1 }`       | The separation between translation controls and the center of the controls object.                                                                                                                                                                                                         |
| orientation                        | `{ x: 0, y: 0, z: 0, w: 1 }` | The initial orientation (in quaternion form) of the controls object.                                                                                                                                                                                                                       |
| hideOtherHandlesOnSelect           | `true`                       | Hide all other handles of the controls object while being interacted with.                                                                                                                                                                                                                 |
| hideOtherControlsInstancesOnSelect | `true`                       | Hide all other controls objects from the scene when being interacted with.                                                                                                                                                                                                                 |
| showHelperPlane                    | `false`                      | Useful for debug. Shows the intersection plane used in raycasting.                                                                                                                                                                                                                         |

The options can be specified as:

```js
// box: THREE.Object3d
import { ANCHOR_MODE } from 'three-freeform-controls';
const controls = controlsManager.anchor(
  box,
  {
    mode: ANCHOR_MODE.FIXED, // or ANCHOR_MODE.INHERIT
    separationT: {
      x: 1,
      y: 1,
      z: 1
    },
    orientation: {
      x: 0,
      y: 0,
      z: 0,
      w: 1,
    },
    hideOtherHandlesOnSelect: true,
    hideOtherControlsInstancesOnSelect: true,
    showHelperPlane: false
  }
);
```

### Different anchors on different objects

The `controlsManager` can be used to anchor the controls on more than one object as well.
An example illustrating the different anchor modes on different objects can be accessed [here]({{ site.baseurl }}/examples/different-anchors-different-objects).

### Different anchors on the same object

Sometimes it is necessary to have some controls handles behave differently (or perhaps at different orientation) than others. In that case the `controlsManager` can be used to anchor different partial controls on the same object.
More on partial controls in [Partial Controls]({{ site.baseurl }}/docs/partial-controls).

An example illustrating different anchor modes for multiple partial controls on the same object can be accessed [here]({{ site.baseurl }}/examples/different-anchors-same-object).

## detach

The anchored controls can be detached like this:

```js
controlsManager.detach(object, controls);
```
