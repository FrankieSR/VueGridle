# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.1.0](https://github.com/FrankieSR/VueGridle/compare/v1.0.2...v1.1.0) (2026-07-13)

### Features

- add `Grid :layout` as the preferred collision context API
- add keyboard accessibility controls for moving and resizing focused grid items
- add explicit `vuegridle/style.css` package export

### Bug Fixes

- make `gridCellSize` reactive to prop updates
- use pointer events for drag and resize interactions
- support external `modelValue` and layout reset updates more reliably
- keep drag and resize values inside grid bounds after snapping
- clean up global interaction listeners on unmount

### Refactors

- replace string-based grid context injection with a typed injection key
- reduce the public entry API to stable components and types
- remove unused internal layout composable from the published source
- reduce package contents by excluding non-runtime assets and sourcemaps

### Tests

- add Vitest coverage for `Grid :layout` collision context

### Documentation

- document the controlled layout API and deprecated `GridItem :allNodes`
- add accessibility, SSR, migration, styles, events, and real project examples
- expand VitePress examples for dashboard, keyboard controls, persisted layouts, and drag outside

### [1.0.2](https://github.com/FrankieSR/VueGridle/compare/v1.0.1...v1.0.2) (2026-07-12)

### Bug Fixes

- sync grid item state from `modelValue` updates
- use current resized item dimensions while dragging
- keep snapped drag and resize values inside grid bounds
- throw a clear error when `GridItem` is used outside `Grid`
- clean up drag and resize listeners on unmount
- prevent hover, active, collision, and drag states from visually shifting or scaling grid items

### [1.0.1](https://github.com/FrankieSR/VueGridle/releases/tag/v1.0.1) (2025-03-11)
