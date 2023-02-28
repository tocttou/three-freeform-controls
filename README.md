# three-freeform-controls

[![npm version](https://badge.fury.io/js/three-freeform-controls.svg)](https://badge.fury.io/js/three-freeform-controls)
![Built with TypeScript](https://flat.badgen.net/badge/icon/TypeScript?icon=typescript&label&labelColor=blue&color=555555)
[![Build Status](https://travis-ci.org/tocttou/three-freeform-controls.svg?branch=master)](https://travis-ci.org/tocttou/three-freeform-controls)

This library provides rotation and translation controls for [THREE.JS](https://threejs.org/) objects.

### [Documentation](https://ashishchaudhary.in/three-freeform-controls)

![screenshot](https://i.imgur.com/cTJTG9o.png)

---

### Changelog

#### v0.3.0 [March 1, 2023]
- Rework the rotation and translation maths; thanks to [@kineticsystem](https://github.com/kineticsystem)
- Update peer dependencies to `"three": ">=0.150.1"`
- Update dev dependencies and examples

### Local development:
- Install dependencies: `npm install`
- Build and watch the source code: `npm run start`

### Running examples:
- Make sure to build the source code
- Run examples: `npm run examples`
- To see a specific example in fullscreen, use the filename from `examples/` folder(like `localhost:10001/?example=basic` or `localhost:10001/?example=transition-limit`)

### The following features are currently supported:

- [x] translation controls with 3 degrees of freedom
- [x] rotation controls with 3 degrees of freedom
- [x] translation and rotation controls about arbitrary axes
- [x] plane controls for translation restricted to an arbitrary plane
- [x] rotation controls in the eye plane
- [x] free-pick controls for translation in the eye plane
- [x] fixed mode controls (retain orientation wrt. object rotation)
- [x] inherit mode controls (make controls follow object rotation)
- [x] custom objects as controls handles
- [x] enabling partial controls only
- [x] multiple instances of controls anchored to a single object
- [x] different instances of controls anchored to a different objects
- [x] snap to grid
- [x] translation limits along individual axes 

### Todo:

- [ ] tests

---
## About the project

### License

`three-freeform-controls` is distributed with an [MIT license](https://raw.githubusercontent.com/tocttou/three-freeform-controls/master/LICENSE).

### Contributing

When contributing to this repository, please first discuss the change you wish to make via an issue on the [Github Repo](https://github.com/tocttou/three-freeform-controls/issues/new).
