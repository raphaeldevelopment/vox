# Changelog

All notable changes to Vox will be documented in this file.

The format follows Keep a Changelog principles and semantic versioning.

# Changelog

All notable changes to this project will be documented in this file.

---

## [0.3.1] - 2026-03-18

### Fixed
- Fixed edge cases where effects could execute multiple times during the same flush cycle.
- Fixed scheduler timing inconsistencies when batching updates across animation frames.
- Fixed incorrect dependency tracking when reactive values were mutated inside nested effects.

### Improved
- Improved batching performance for large numbers of reactive updates.
- Reduced unnecessary effect executions during DOM updates.
- Improved internal scheduler stability for frame-based flush cycles.
- Added Typescript

### Added
- Added additional unit tests for reactivity edge cases and effect cleanup behavior.
- Expanded DOM test coverage for directive updates.

### Internal
- Refactored reactivity core for clearer dependency tracking.
- Minor runtime size optimizations.
- Improved test infrastructure and CI configuration.

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
