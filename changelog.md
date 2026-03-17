# Changelog

All notable changes to Vox will be documented in this file.

The format follows Keep a Changelog principles and semantic versioning.

---

# [0.3.0] - 2026-03-17

## Added

* Added full public API contract documentation for all exported primitives
* Introduced `docs/api-contract.md` as formal reference for supported public APIs
* Defined guarantees, limitations, and edge-case expectations for:

  * `createVariable`
  * `compose`
  * `watch`
  * `untrack`
  * `createEffect`
  * `voxMain`
  * `State`
  * `VariableRegistry`
  * `CallbackRegistry`
  * `batch`
  * `batchAsync`

## Documentation

* Clarified public vs internal API boundaries
* Added explicit stability policy for public exports
* Documented expected behavior for reactive scheduling
* Documented non-guaranteed behavior for dependency tracking and batching

## Internal Notes

* No runtime behavior changed
* No breaking API changes introduced
* This release focuses on API clarity and maintainability

## Migration

No migration required.
