---
layout: default
title: Custom Handles
nav_order: 6
parent: Usage
---

While customizing the default handles goes a long way, sometimes it is necessary to add your own implementation.

There are two ways to do this:

1. create new instances of the default handles and attach them to the controls object via `controls.setupHandle`.
2. implement the abstract group classes to create the handles and then use `controls.setupHandle`

Note that the rules of [modifying the up and parallel vectors]({{ site.baseurl }}/docs/usage/customize-handles#manipulating-default-handles-objects) when modifying the default handles, applies to custom handles as well.

## Custom handles by instantiating default handles

```js
import { Translation, Rotation } from "three-freeform-controls";
// ...
const controls = ControlsManager.anchor(box);
controls.showAll(false);

// create custom handles
const translationHandle = new Translation("cyan");
const rotationHandle = new Rotation("pink");

translationHandle.name = "TranslationHandle";
rotationHandle.name = "RotationHandle";

// modify the handles
translationHandle.rotateZ(-Math.PI / 2);

// modify the "up" vector to point perpendicular to the desired interaction plane of the object
translationHandle.up = new THREE.Vector3(0, 1, 0);
rotationHandle.up = new THREE.Vector3(0, 0, 1);

// only for handles of type "TranslationGroup",
// modify the "parallel" vector to point to the direction in which the handle is pointing
translationHandle.parallel = new THREE.Vector3(1, 0, 0);

// setup the custom handles
controls.setupHandle(translationHandle);
controls.setupHandle(rotationHandle);
```

An example of the above snippet can be accessed below.

[View example]({{ site.baseurl }}/examples/custom-handles-1){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }{:target="_blank"}

## Custom handles by extending handles groups

The following handles groups are available:

```js
import { PickGroup, PickPlaneGroup, RotationGroup, TranslationGroup } from "three-freeform-controls";
```

Extending any of these groups requires implementing the following properties:

1. [getInteractiveObjects]({{ site.baseurl }}/apiref/classes/handlegroup.html#getinteractiveobjects){:target="_blank"}: returns an array of the all the objects that are interactive in the handle
2. [setColor]({{ site.baseurl }}/apiref/classes/handlegroup.html#setcolor){:target="_blank"}: sets the color for the handle

**In addition, the `TranslationGroup` also requires implementing a `parallel` vector property on the handle.**

Once the custom handle class has been created, it can be instantiated and the `up` and `parallel` vectors should be handled accordingly as above.

### example custom rotation handle

In the below example, we create a rotation handle with these properties:

1. an interactive ball surrounded by a non-interactive ring
2. the ball is 1.5 units above the object
3. the rotation is along the z-axis

```js
import { RotationGroup } from "three-freeform-controls";
// ...
const controls = ControlsManager.anchor(box);
controls.showAll(false);

class CustomRotation extends RotationGroup {
  constructor(color) {
    super();
    this.ball = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 32, 32),
      new THREE.MeshNormalMaterial()
    );
    this.ring = new THREE.Mesh(
      new THREE.RingGeometry(0.2, 0.3, 8),
      new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide })
    );

    // add all the visual elements to the handles object
    this.add(this.ball);
    this.add(this.ring);
  }

  getInteractiveObjects = () => {
    // only return the interactive children objects in the handles object
    return [this.ball];
  };

  setColor = color => {
    this.ring.material.color.set(color);
  };
}

// the rest of the flow is same as previous examples
const customRotationHandle = new CustomRotation("yellow");
customRotationHandle.name = "Custom Rotation Handle";
customRotationHandle.position.set(0, 1.5, 0);
customRotationHandle.up = new THREE.Vector3(0, 0, 1);
controls.setupHandle(customRotationHandle);
```

The above illustrated example can be accessed below.

[View example]({{ site.baseurl }}/examples/custom-handles-2){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }{:target="_blank"}

Note that the centre of rotation remains the position of the `controls` object, and not the position of the individual handles.

Next section: [API Reference]({{ site.baseurl }}/docs/api)
