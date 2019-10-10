---
layout: default
title: Partial Controls
nav_order: 4
parent: Usage
---

Handles in controls can be enabled selectively.

## showAll

Hiding all handles:

```js
// ...
const controls = ControlsManager.anchor(box);
controls.showAll(false); // or true to make all handles visible
```

## showByNames

Hiding handles selectively:

```js
import { DEFAULT_HANDLE_GROUP_NAME } from 'three-freeform-controls';
// ...
const controls = ControlsManager.anchor(box);
controlsFixed.showByNames([
  DEFAULT_HANDLE_GROUP_NAME.ZPT,
  DEFAULT_HANDLE_GROUP_NAME.ZNT,
  DEFAULT_HANDLE_GROUP_NAME.ZR
], false); // or true to make these handles visible, if not already
```

The above snippet hides the positive translation, negative translation, and rotation z-handles.
Details on the handle names can be found in the [API docs]({{ site.baseurl }}/docs/api/default_handle_group_name.html).

If the user wants to show only some specific handles, it can be done by:
1. `showAll(false)`: to hide all the handles at first
2. `showByNames([handlesToShow], true)`: to display only selective handles

An example for these can be accessed [here]({{ site.baseurl }}/examples/partial-controls){:target="_blank"}.
