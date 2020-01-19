---
layout: home
title: Home
nav_order: 1
permalink: /
---

![screenshot](https://i.imgur.com/cTJTG9o.png)

[![npm version](https://badge.fury.io/js/three-freeform-controls.svg)](https://badge.fury.io/js/three-freeform-controls)
![Built with TypeScript](https://flat.badgen.net/badge/icon/Built with TypeScript?icon=typescript&label&labelColor=blue&color=555555)
[![Build Status](https://travis-ci.org/tocttou/three-freeform-controls.svg?branch=master)](https://travis-ci.org/tocttou/three-freeform-controls)

# three-freeform-controls

This library provides rotation and translation controls for [THREE.JS](https://threejs.org/) objects.

[Get started now]({{ site.baseurl }}/docs/getting-started.html){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[See basic example]({{ site.baseurl }}/examples/basic){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }{:target="_blank"}
[View it on GitHub](http://github.com/tocttou/three-freeform-controls){: .btn .fs-5 .mb-4 .mb-md-0 }{:target="_blank"}

---

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

### Todo:

- [ ] snap in Translation controls
- [ ] tests

---
## About the project

### License

`three-freeform-controls` is distributed with an [MIT license](https://raw.githubusercontent.com/tocttou/three-freeform-controls/master/LICENSE).

### Contributing

When contributing to this repository, please first discuss the change you wish to make via an issue on the [Github Repo](https://github.com/tocttou/three-freeform-controls/issues/new).
