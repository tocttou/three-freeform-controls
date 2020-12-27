---
layout: default
title: Getting Started
nav_order: 2
---
## Installation

### via NPM

```bash
npm install --save three-freeform-controls
```

Available as:

```js
import * as FreeformControls from 'three-freeform-controls';
```

```js
// individual components can be imported as well
import { ControlsManager } from 'three-freeform-controls';
```

OR

### via including UMD Module on page


```html
<!-- Import three.js first -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r123/three.min.js"></script>
<!-- Then import three-freeform-controls -->
<script src="https://cdn.jsdelivr.net/npm/three-freeform-controls@0.1.12/dist/three-freeform-controls.umd.js"></script>
```

Available as: object `FreeformControls` on the `window` scope.

---
## Basic Usage

Given a three.js camera, scene, and renderer:

```js
const controlsManager = new FreeformControls.ControlsManager(
  camera,
  renderer.domElement
);
scene.add(controlsManager);
```

Now anchoring the controls on a three.js object:

```js
// box is of type THREE.Object3D
// box can thus be a THREE.Mesh or a THREE.Group for a group of objects
const controls = controlsManager.anchor(box);
```

[View example]({{ site.baseurl }}/examples/basic.html){:target="_blank"}{: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }

![screenshot](https://i.imgur.com/b1cxpHs.png)

Next section: [Usage]({{ site.baseurl }}/docs/usage)


