# Vox

**Vox** is a lightweight experimental reactive JavaScript library focused on simple DOM-driven reactivity, tiny bundle size, and minimal runtime abstractions.

It is designed as a small reactive engine for learning, experimenting, and building lightweight interfaces without the overhead of a full framework.

---

## Benchmark Notes

Vox batches updates per animation frame.

Local benchmark results:
- 10,000 variable writes + flush: ~10.4ms
- 1,000 effect registrations: ~11.1ms
- 100 reactive DOM nodes updated through a single batched flush: ~11.1ms
- 100 reactive DOM nodes updated unbatched across 100 frames: ~1111ms

This shows that Vox performs best in its intended batched update model, where repeated writes are coalesced before DOM work is applied.
---

## Features

* Reactive variables
* Reactive effects
* Lightweight DOM bindings
* Conditional rendering
* List rendering
* Attribute bindings
* Event bindings
* Persistent state support
* Tiny bundle size (~3 KB gzipped target)

---

## Philosophy

Vox keeps the runtime small and explicit:

* No virtual DOM
* No compiler step required for usage
* DOM-first architecture
* Small API surface
* Easy to inspect internals

The goal is not to compete with large frameworks, but to provide a clean experimental playground for reactive architecture.

---

## Installation

```bash
npm install voxjs
```

---

## Basic Usage

```js
import { createVariable, createEffect } from "voxjs";

const [count, setCount] = createVariable(0);

createEffect(() => {
    console.log(count.getValue());
}, [count]);

setCount(1);
setCount(2);
```

---

## DOM Initialization

```js
import { voxMain } from "voxjs";

voxMain();
```

---

## Template Example

```html
<div vox-text="counter"></div>
<button vox-click="increment">+</button>
```

---

## State Management

```js
import { State } from "voxjs";

const state = State.getInstance();
state.create("user");
state.addVariable("user", "name", "Ana");

console.log(state.get("user", "name"));
```

---

## Build

```bash
npm run build
```

Build output:

```bash
dist/
  vox.esm.js
  vox.cjs
```

---

## Development

```bash
npm run watch
```

---

## Project Status

Vox is currently experimental and under active internal iteration.

APIs may change while core architecture stabilizes.

---

## Goals

* Keep runtime small
* Improve consistency of reactive internals
* Expand directive system
* Add stronger testing coverage
* Stabilize public API

---

## License

MIT
