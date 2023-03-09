---
layout: default
title: Events
nav_order: 3
parent: Usage
---

## [listen ![link](https://img.icons8.com/ios/24/000000/external-link.png){: .link-icon }]({{ site.baseurl }}/apiref/classes/ControlsManager.html#listen){:target="_blank"}

The `FreeformControls.ControlsManager` instance allows listening to the following events on controls:

- `DRAG_START`: Triggered once when the controls become active.

```js
import { EVENTS } from 'three-freeform-controls';
// ...
controlsManager.listen(EVENTS.DRAG_START, (object, handleName) => {
  // This place can be used to disable the scene controls like OrbitControls
  orbitControls.enabled = false;
});
```

- `DRAG_STOP`: Triggered once when the controls become inactive.

```js
import { EVENTS } from 'three-freeform-controls';
// ...
controlsManager.listen(EVENTS.DRAG_STOP, (object, handleName) => {
  // This place can be used to re-enable the scene controls like OrbitControls
  orbitControls.enabled = true;
});
```

- `DRAG`: Triggered on each drag event on the controls object.

```js
import { EVENTS } from 'three-freeform-controls';
// ...
controlsManager.listen(EVENTS.DRAG, (object, handleName) => {
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
that was involved in the interaction - it can be one of the [default names]({{ site.baseurl }}/apiref/enums/default_handle_group_name.html){:target="_blank"}
or the corresponding string for custom handles.

## [removeListen ![link](https://img.icons8.com/ios/24/000000/external-link.png){: .link-icon }]({{ site.baseurl }}/apiref/classes/ControlsManager.html#removeListen){:target="_blank"}

An attached listener function can be removed like this:

```js
controlsManager.removeListen(EVENTS.DRAG, listenerFn);
```

An example illustrating these events can be accessed below.

[View example]({{ site.baseurl }}/examples/?example=events){:target="_blank"}{: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }

Next section: [Partial Controls]({{ site.baseurl }}/docs/usage/partial-controls)
