---
layout: default
title: Events
nav_order: 3
parent: Usage
---

## listen

The `FreeformControls.ControlsManager` instance allows listening to the following events on controls:

- `DRAG_START`: Triggered once when the controls become active.

```js
import { RAYCASTER_EVENTS } from 'three-freeform-controls';
// ...
controlsManager.listen(RAYCASTER_EVENTS.DRAG_START, (object, handleName) => {
  // This place can be used to disable the scene controls like OrbitControls
  orbitControls.enabled = false;
});
```

- `DRAG_STOP`: Triggered once when the controls become inactive.

```js
import { RAYCASTER_EVENTS } from 'three-freeform-controls';
// ...
controlsManager.listen(RAYCASTER_EVENTS.DRAG_STOP, (object, handleName) => {
  // This place can be used to re-enable the scene controls like OrbitControls
  orbitControls.enabled = true;
});
```

- `DRAG`: Triggered on each drag event on the controls object.

```js
import { RAYCASTER_EVENTS } from 'three-freeform-controls';
// ...
controlsManager.listen(RAYCASTER_EVENTS.DRAG, (object, handleName) => {
  // This place can be used to ingest information about the object
  // to which the controls were anchored
  const positionOfObjectToWhichControlsWereAnchored = object.position;
  websocket.send(positionOfObjectToWhichControlsWereAnchored);
});
```

The signature of the callback is:

```ts
callback: (object: THREE.Object3d, handleName: string) => void
```

Here the `object` is the object to which the controls were anchored to and `handleName` is the name of the handle
that was involved in the interaction.

## removeListen

An attached listener function can be removed like this:

```js
controlsManager.removeListen(RAYCASTER_EVENTS.DRAG, listenerFn);
```

An example illustrating these events can be accessed here.
