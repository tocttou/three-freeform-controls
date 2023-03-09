---
layout: default
title: Translation Limit
nav_order: 7
parent: Usage
---

## Translation limit

Translation limit can be set on the controls. The anchor point is the position of the object when the 
[setTranslationLimit]({{ site.baseurl }}/apiref/classes/controls.html#settranslationlimit){:target="_blank"} function is called.
This puts a limit on the object's translation.

`{ x: [-1, 2], y: false, z: false }` - sets the translation limit to 1 unit in the -x-direction, +2 units in the +x-direction, and no limit on the y and z-direction.
Setting the limit to false disables the limit in all directions.

```js
const controls = new ControlsManager.anchor(box);
// move the object around
box.position.z = 1;
// set translation limit around the object's position (0, 0, 1)
controls.setTranslationLimit({
  x: [-1, 3],
  y: false,
  z: false
});
// disable all limits
controls.setTranslationLimit(false);
```

An example showing translation limits can be seen below.

[View example]({{ site.baseurl }}/examples/?example=translation-limit){:target="_blank"}{: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }

Next section: [API Reference]({{ site.baseurl }}/docs/api)
