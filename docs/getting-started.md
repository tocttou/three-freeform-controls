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
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/109/three.min.js"></script>
<!-- Then import three-freeform-controls -->
<script src="https://cdn.jsdelivr.net/npm/three-freeform-controls@latest/dist/three-freeform-controls.umd.js"></script>
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

![screenshot](https://i.imgur.com/b1cxpHs.png)

The above illustrated example can be accessed [here]({{ site.baseurl }}/examples/basic.html){:target="_blank"}. 


