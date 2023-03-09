---
layout: default
title: Customize Handles
nav_order: 5
parent: Usage
---

The `Three.js` objects for the handles can be accessed as properties on the `Controls` instance.

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

| handle name                                                                                                      | `Three.js` object                                                                                         |
| :--------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| [XPT]({{ site.baseurl }}/apiref/enums/default_handle_group_name.html#xpt){:target="_blank"}                      | [controls.translationXP]({{ site.baseurl }}/apiref/classes/controls.html#translationxp){:target="_blank"} |
| [XNT]({{ site.baseurl }}/apiref/enums/default_handle_group_name.html#xnt){:target="_blank"}                      | [controls.translationXN]({{ site.baseurl }}/apiref/classes/controls.html#translationxn){:target="_blank"} |
| [YPT]({{ site.baseurl }}/apiref/enums/default_handle_group_name.html#ypt){:target="_blank"}                      | [controls.translationYP]({{ site.baseurl }}/apiref/classes/controls.html#translationyp){:target="_blank"} |
| [YNT]({{ site.baseurl }}/apiref/enums/default_handle_group_name.html#ynt){:target="_blank"}                      | [controls.translationYN]({{ site.baseurl }}/apiref/classes/controls.html#translationyn){:target="_blank"} |
| [ZPT]({{ site.baseurl }}/apiref/enums/default_handle_group_name.html#zpt){:target="_blank"}                      | [controls.translationZP]({{ site.baseurl }}/apiref/classes/controls.html#translationzp){:target="_blank"} |
| [ZNT]({{ site.baseurl }}/apiref/enums/default_handle_group_name.html#znt){:target="_blank"}                      | [controls.translationZN]({{ site.baseurl }}/apiref/classes/controls.html#translationzn){:target="_blank"} |
| [XR]({{ site.baseurl }}/apiref/enums/default_handle_group_name.html#xr){:target="_blank"}                        | [controls.rotationX]({{ site.baseurl }}/apiref/classes/controls.html#rotationx){:target="_blank"}         |
| [YR]({{ site.baseurl }}/apiref/enums/default_handle_group_name.html#yr){:target="_blank"}                        | [controls.rotationY]({{ site.baseurl }}/apiref/classes/controls.html#rotationy){:target="_blank"}         |
| [ZR]({{ site.baseurl }}/apiref/enums/default_handle_group_name.html#zr){:target="_blank"}                        | [controls.rotationZ]({{ site.baseurl }}/apiref/classes/controls.html#rotationz){:target="_blank"}         |
| [ER]({{ site.baseurl }}/apiref/enums/default_handle_group_name.html#er){:target="_blank"}                        | [controls.rotationEye]({{ site.baseurl }}/apiref/classes/controls.html#rotationeye){:target="_blank"}     |
| [PICK_PLANE_XY]({{ site.baseurl }}/apiref/enums/default_handle_group_name.html#pick_plane_xy){:target="_blank"}  | [controls.pickPlaneXY]({{ site.baseurl }}/apiref/classes/controls.html#pickplanexy){:target="_blank"}     |
| [PICK_PLANE_YZ]({{ site.baseurl }}/apiref/enums/default_handle_group_name.html#pick_plane_yz){:target="_blank"}  | [controls.pickPlaneYZ]({{ site.baseurl }}/apiref/classes/controls.html#pickplaneyz){:target="_blank"}     |
| [PICK_PLANE_ZX]({{ site.baseurl }}/apiref/enums/default_handle_group_name.html#pick_plane_zx){:target="_blank"}  | [controls.pickPlaneZX]({{ site.baseurl }}/apiref/classes/controls.html#pickplanezx){:target="_blank"}     |
| [PICK]({{ site.baseurl }}/apiref/enums/default_handle_group_name.html#pick){:target="_blank"}                    | [controls.pick]({{ site.baseurl }}/apiref/classes/controls.html#pick){:target="_blank"}                   |


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

<div class="orange-box">
In case the rotated handle is of type `Translation` or `TranslationGroup`, it is necessary to rotate the `parallel` vector along with the `up` vector.
</div>

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

An example illustrating rotation, translation, and color change for default handles can be accessed below.

[View example]({{ site.baseurl }}/examples/?example=customize-handles){:target="_blank"}{: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }

Next section: [Custom Handles]({{ site.baseurl }}/docs/usage/custom-handles)
