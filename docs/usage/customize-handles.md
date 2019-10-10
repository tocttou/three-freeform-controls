---
layout: default
title: Customize Handles
nav_order: 5
parent: Usage
---

The three.js objects for the handles can be accessed directly from the controls object for modification.

The below table maps all the default handle objects available to their handle names.

Note that:

1. the handle names are accessible on the `DEFAULT_HANDLE_GROUP_NAME` export.
2. the handle objects are accessible on the `Controls` instance.

```js
import { DEFAULT_HANDLE_GROUP_NAME } from "three-freeform-controls";
console.log(DEFAULT_HANDLE_GROUP_NAME.ZPT); // zpt_handle
// ...
const controls = ControlsManager.anchor(box);
console.log(controls.translationZP); // three.js object
```

| handle name   | three.js object        |
| :------------ | :--------------------- |
| XPT           | controls.translationXP |
| XNT           | controls.translationXN |
| YPT           | controls.translationYP |
| YNT           | controls.translationYN |
| ZPT           | controls.translationZP |
| ZNT           | controls.translationZN |
| XR            | controls.rotationX     |
| YR            | controls.rotationY     |
| ZR            | controls.rotationZ     |
| ER            | controls.rotationEye   |
| PICK_PLANE_XY | controls.pickPlaneXY   |
| PICK_PLANE_YZ | controls.pickPlaneYZ   |
| PICK_PLANE_ZX | controls.pickPlaneZX   |
| PICK          | controls.pick          |


## Manipulating default handles objects

The three.js objects for handles can be manipulated as usual, albeit with the following precautions:

### If the handles are rotated explicitly, apply the same operation to the `up` vector on the object:

The `up` vector is a vector normal to the handles object. This vector is used to find the interaction plane for raycasting.

```js
const controls = ControlsManager.anchor(box);
const quaternion = new THREE.Quaternion(-0.007, -0.776, 0.554, 0.301);
// rotating the rotationY handle
controls.rotationY.applyQuaternion(quaternion);
// the up vector also must be rotated
controls.rotationY.up.applyQuaternion(quaternion);
```

**In case the rotated handle is of type `Translation` or `TranslationGroup`, it is necessary to rotate the `parallel` vector along with the `up` vector.**

The `parallel` vector is a vector parallel to the handles object. This is defined only for the instances of `TranslationGroup`.

```js
// rotating the translationYP handle
controls.translationYP.applyQuaternion(quaternion);
// the up vector also must be rotated
controls.translationYP.up.applyQuaternion(quaternion);
// the parallel vector also must be rotated
controls.translationYP.parallel.applyQuaternion(quaternion);
```
### Customizing color

Since the handles objects can be accessed directly, their appearance can be modified by modifying the object.

It is more convenient to use the `setColor` function on the handles:

```js
const controls = new ControlsManager.anchor(box);
controls.rotationY.setColor("pink");
```

An example illustrating rotation, translation, and color change for default handles can be accessed [here]({{ site.baseurl }}/examples/customize-handles){:target="_blank"}.
