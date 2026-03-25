# Vox

**Vox** is a lightweight experimental reactive JavaScript runtime built around **DOM-first reactivity**.

It focuses on:

* simple reactive primitives
* minimal runtime abstractions
* direct DOM bindings
* small bundle size

Vox is designed as a **reactive engine**, not a full framework.
It avoids virtual DOM, components, and compilation steps in favor of **direct reactive DOM updates**.

---

# Features

* Reactive variables
* Reactive effects
* Derived values (`compose`)
* Reactive watchers
* Batched updates
* Lightweight DOM directives
* Conditional rendering
* List rendering
* Attribute bindings
* Event bindings
* Persistent state
* Tiny runtime
* Can be easily extended with directives

---

# Philosophy

Vox follows a **minimal runtime philosophy**:

* No virtual DOM
* No component system
* No compilation step
* DOM-first architecture
* Small API surface
* Easy to inspect internals

The goal is not to compete with large frameworks, but to provide a clean playground for reactive architecture and lightweight interfaces.

---

# Installation

```bash
npm install vox-engine
```

---

# Core API

## Reactive Variables

```js
import { createVariable } from "vox-engine";

const [count, setCount] = createVariable(0);

setCount(1);
setCount(2);

console.log(count.getValue());
```

---

## Effects

```js
import { createEffect } from "vox-engine";

createEffect(() => {
  console.log(count.getValue());
}, [count]);
```

Effects run whenever dependencies change.

---

## Derived Values

```js
import { compose } from "vox-engine";

const doubled = compose(() => count.getValue() * 2);
```

Derived values recompute automatically.

---

## Watchers

```js
import { watch } from "vox-engine";

watch(count, (value) => {
  console.log("count changed:", value);
});
```

---

## Batching

```js
import { batch } from "vox-engine";

batch(() => {
  setCount(1);
  setCount(2);
  setCount(3);
});
```

Async batching:

```js
import { batchAsync } from "vox-engine";

await batchAsync(async () => {
  setCount(10);
  setCount(20);
});
```

---

# DOM Runtime

Initialize Vox:

```js
import { voxMain } from "vox-engine";

voxMain();
```

The runtime scans the DOM and attaches reactive bindings.

Supported internally:

* variable bindings
* attribute bindings
* value bindings
* event handlers
* conditionals
* list rendering

---

# DOM Directives

Vox provides lightweight DOM directives that attach reactive behavior directly to HTML elements.

These directives are parsed when `voxMain()` runs and are applied directly to the existing DOM.

---

## Text Binding

Bind reactive values directly to text content.

```html id="x9f0np"
<span vox-text="count"></span>
```

When `count` changes, the text updates automatically.

---

## Event Binding

Attach functions to DOM events.

```html id="4bzk7l"
<button vox-click="increment">+</button>
```

The named callback must exist in the callback registry.

---

## Conditional Rendering

Render elements conditionally.

```html id="j6s0w2"
<div vox-if="isVisible">
  Visible content
</div>
```

The element is shown or removed depending on the reactive value.

---

## List Rendering

Repeat elements from arrays.

```html id="98u1qa"
<li vox-for="item in items">
  <span vox-text="item"></span>
</li>
```

The DOM updates automatically when the array changes.

---

## Value Binding

Bind input values reactively.

```html id="a7y6mr"
<input vox-value="username" />
```

Typing updates the reactive variable and keeps DOM in sync.

---

## Attribute Binding

Bind reactive values to attributes.

```html id="q2n8vc"
<img vox-src="imageUrl" />
```

Attributes update automatically when values change.

---

## Template Processing

Vox also scans `<template>` nodes and activates directives inside cloned content when needed.

This allows directives to work in repeated or conditional DOM structures.

---

## Runtime Activation

Initialize all directives by running:

```js id="w4p8dh"
import { voxMain } from "vox-engine";

voxMain();
```

The runtime scans the DOM and activates all supported directives.


# State Management

```js
import { State } from "vox-engine";

const state = State.getInstance();

state.create("user");
state.addVariable("user", "name", "Ana");

console.log(state.get("user", "name"));
```
---
# Extensibility

Vox can be extended via its directive system.

Possible extensions include:

- custom event handlers
- DOM transformations
- reusable behavior patterns

```js
const directiveRegistry = DirectiveRegistry.getInstance();

directiveRegistry.set({
    name: directiveName, 
    // Unique identifier for the directive (internal use).
    // Should NOT start with "vox" (reserved for core directives).

    key: attrName, 
    // The DOM attribute name this directive listens to.
    // Example: "vox-if", "vox-for", "vox-model"

    selector: selector, 
    // Defines which elements this directive applies to.
    // Can be:
    // - a CSS selector string (e.g. "[vox-if]")
    // - a function that returns a list of matching elements

    logic: checkForEachLogic 
    // The function executed for each matched element.
    // Receives the element and directive value,
    // and contains the actual behavior (DOM updates, reactivity, etc.)
});
```

---

# Advanced API

```js
import {
  VariableRegistry,
  CallbackRegistry,
  untrack
} from "vox-engine";
```

These are intended for advanced usage and internal experimentation.

---

# Instalation

```bash
npm install vox-engine
```

or

```bash
pnpm add vox-engine
```

---

# Development

Build:

```bash
npm run build
```

Watch mode:

```bash
npm run watch
```

Run tests:

```bash
npm test
```

---

# Project Status

Vox is now **API-stable**.

* The core API is considered final and will not change in breaking ways
* Future updates will focus on stability, bug fixes, and improvements
* Any breaking changes will require a major version bump

Vox is ready for real-world usage in its intended scope.


---
## Changelog

See full release history in [CHANGELOG.md](./changelog.md)
---
# License

MIT
