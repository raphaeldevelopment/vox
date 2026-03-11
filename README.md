# Vox

Vox is a lightweight experimental reactive JavaScript library built to explore how modern frontend reactivity works internally.

The project focuses on a minimal runtime that connects **state**, **effects**, and **DOM bindings** through simple declarative `vox-*` attributes.

---

## Features

* Reactive variables
* Effects / dependencies
* Conditional rendering (`vox-if`)
* List rendering (`vox-for-each`)
* Template loading (`vox-template`)
* Attribute bindings (`vox-attr-*`)
* Input bindings
* Event bindings

---

## Installation

```bash
npm install
```

---

## Basic Usage

```js
import { createVariable } from "./src/index.js";

const [count, setCount] = createVariable(0);
```

---

## Bind Variable to DOM

```html
<p vox-variable="count"></p>
```

When the variable changes, the DOM updates automatically.

---

## Input Binding

```html
<input vox-value="count">
```

---

## Conditional Rendering

```html
<div vox-if="isVisible">
  Visible content
</div>
```

---

## List Rendering

```html
<li vox-for-each="item in items">
  <span vox-variable="item"></span>
</li>
```

---

## Event Binding

```html
<button vox-on:click="increment">
  Increment
</button>
```

---

## Template Loading

```html
<div vox-template="./template.html"></div>
```

Template supports interpolation:

```html
<p>{{ name }}</p>
```

---

## Example

```js
const [name, setName] = createVariable("Raphael");

registry.set("name", name);
registry.set("setName", setName);
```

```html
<input vox-value="name" vox-set-value="setName">
<p vox-variable="name"></p>
```

---

## Goal

Vox is an educational micro-framework designed to better understand:

* reactivity
* dependency tracking
* DOM runtime behavior
* declarative bindings

---

## Status

Experimental — currently evolving.

---

## License

MIT
