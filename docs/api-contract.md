# Vox Public API Contract

This document defines the supported public API surface of Vox.

It exists to make the library predictable for users and contributors by documenting:

* what each exported API does
* what inputs it accepts
* what it returns
* what behavior is guaranteed
* what behavior is intentionally not guaranteed
* important edge cases and limitations

Unless otherwise stated, only the APIs documented here are considered public and stable.

---

# `createVariable(initialValue, variables = [], computedValue)`

## Purpose

Creates a reactive variable and returns the variable together with its setter callback.

It supports:

* direct reactive values
* computed values
* derived values with dependencies

## Input

* `initialValue`: any value or a function
* `variables`: array of dependent variables for computed mode
* `computedValue`: optional initial computed result

## Return

```js
[variable, setter]
```

* `variable`: reactive variable instance
* `setter`: callback wrapper used to update value

## Guarantees

* Updates only occur when `Object.is(newValue, oldValue)` returns false
* Subscribers are notified through the internal scheduler
* Computed variables reconnect dependencies when formulas change
* Previous cleanup is executed before rebinding computed dependencies

## Non-guarantees

* Deep object mutation tracking is not supported
* Nested object changes do not trigger updates automatically
* Subscriber execution order is not guaranteed as public contract

## Edge Cases

* Setting identical value does not trigger updates
* Function initializers without dependencies execute once during creation

---

# `compose(formula)`

## Purpose

Creates a derived reactive variable by automatically collecting dependencies accessed inside the formula.

## Input

* `formula`: function returning derived value

## Return

```js
variable
```

Reactive derived variable.

## Guarantees

* Dependencies are collected automatically during execution
* Initial formula executes immediately
* Dependency graph rebuilds when accessed dependencies change

## Non-guarantees

* Circular dependency protection is not guaranteed
* Nested dependency graph complexity is not explicitly limited

## Edge Cases

* Conditional dependency branches may rebuild dependency subscriptions

---

# `watch(variable, callback)`

## Purpose

Subscribes to variable changes.

## Input

* `variable`: reactive variable
* `callback`: function executed when variable changes

## Return

```js
unsubscribe
```

Cleanup function.

## Guarantees

* Callback executes when variable updates
* Cleanup removes active subscription

## Non-guarantees

* Immediate first execution is not guaranteed unless manually invoked

## Edge Cases

* Removing subscription during active flush may defer full cleanup until next cycle

---

# `untrack(fn)`

## Purpose

Executes code without collecting reactive dependencies.

## Input

* `fn`: function

## Return

Result of `fn`

## Guarantees

* Reads inside `fn` do not register dependencies

## Non-guarantees

* Does not suppress explicit updates

## Edge Cases

* Nested untrack preserves outer collector state after execution

---

# `createEffect(effect, variables = [])`

## Purpose

Creates a reactive effect bound to dependencies.

## Input

* `effect`: function
* `variables`: dependency list

## Return

```js
cleanup
```

Cleanup function.

## Guarantees

* Effect executes when dependencies change
* Cleanup executes before rebinding

## Non-guarantees

* Circular effect prevention is not guaranteed
* Nested scheduling order is not guaranteed

## Edge Cases

* Effects depending on changing dependency lists may recreate subscriptions

---

# `voxMain()`

## Purpose

Initializes a Vox application root.

## Return

Application result.

## Guarantees

* Root executes inside Vox lifecycle

## Non-guarantees

* SSR compatibility is not guaranteed

---

# `State`

## Purpose

Provides reactive state abstraction.

## Guarantees

* State participates in Vox reactive system

## Non-guarantees

* Deep proxy behavior is not guaranteed unless explicitly implemented

---

# `VariableRegistry`

## Purpose

Internal registry exposed publicly for variable management.

## Guarantees

* Registry stores created variables

## Non-guarantees

* Internal storage format may evolve

---

# `CallbackRegistry`

## Purpose

Internal registry exposed publicly for callback tracking.

## Guarantees

* Stores registered callbacks

## Non-guarantees

* Ordering guarantees are not part of public contract

---

# `batch(fn)`

## Purpose

Groups synchronous updates into a single flush cycle.

## Input

* `fn`: function

## Guarantees

* Multiple updates are flushed together

## Non-guarantees

* Exact flush timing beyond current frame is not guaranteed

---

# `batchAsync(fn)`

## Purpose

Groups asynchronous updates into controlled flush cycle.

## Input

* `fn`: async function

## Guarantees

* Flush occurs after async completion

## Non-guarantees

* Concurrent async batches ordering is not guaranteed

---

# Stability Policy

The APIs documented here are considered public.

Any breaking change should update:

* version number
* changelog
* migration notes

Internal modules not listed here are not part of the public contract.
