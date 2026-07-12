<p align="center">
    <img src="./docs/public/logo.png" alt="VueGridle logo" width="96" height="96" />
</p>

<h1 align="center">VueGridle</h1>

<p align="center">
    Small, typed grid primitives for Vue 3 dashboards and draggable layouts.
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/vuegridle"><img alt="npm version" src="https://img.shields.io/npm/v/vuegridle?label=npm"></a>
    <a href="https://bundlephobia.com/package/vuegridle"><img alt="minified gzip bundle size" src="https://img.shields.io/bundlephobia/minzip/vuegridle?label=minzip"></a>
    <a href="https://www.npmjs.com/package/vuegridle"><img alt="monthly npm downloads" src="https://img.shields.io/npm/dm/vuegridle?label=downloads"></a>
    <a href="https://github.com/FrankieSR/VueGridle/blob/main/LICENSE"><img alt="license" src="https://img.shields.io/npm/l/vuegridle?label=license"></a>
    <a href="https://frankiesr.github.io/VueGridle/"><img alt="documentation" src="https://img.shields.io/badge/docs-online-6ee7b7"></a>
</p>

## Why VueGridle

- **Controlled layout API**: use `v-model` / `modelValue` as the source of truth.
- **Drag and resize**: move and resize items with grid snapping or free movement.
- **Collision detection**: pass `layout` once to `Grid` and receive overlap events from items.
- **Keyboard accessible**: focus items with Tab, move with arrow keys, resize with Shift + arrow keys.
- **Typed Vue 3 API**: built with TypeScript and Composition API.
- **Small public surface**: `Grid`, `GridItem`, and exported types.

---

## Installation ⚡

### Via npm

```bash
npm install vuegridle
```

### Via Yarn

```bash
yarn add vuegridle
```

---

## Quick Start

Add `VueGridle` to your Vue 3 app:

```ts
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { Grid, GridItem } from 'vuegridle';
import 'vuegridle/style.css';

const app = createApp(App);
app.component('Grid', Grid);
app.component('GridItem', GridItem);

app.mount('#app');
```

Now you can use `<Grid>` and `<GridItem>` in your templates.

---

## Compatibility

- Vue 3
- TypeScript projects and JavaScript projects
- Modern browsers with Pointer Events support
- SSR: browser-only interactions run after mount; full SSR hardening is planned

## Basic Usage

**Example** – A simple grid with two draggable items:

```vue
<template>
    <Grid :gridCellSize="50" :layout="layout">
        <GridItem
            v-for="item in layout"
            :key="item.id"
            :nodeId="item.id"
            :x="item.grid.x"
            :y="item.grid.y"
            :w="item.grid.w"
            :h="item.grid.h"
            :draggable="true"
            v-model="item.grid"
        >
            <div>{{ item.id }}</div>
        </GridItem>
    </Grid>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { Grid, GridItem } from 'vuegridle';
    import 'vuegridle/style.css';

    const layout = ref([
        { id: 'item-1', grid: { x: 0, y: 0, w: 200, h: 100 } },
        { id: 'item-2', grid: { x: 50, y: 50, w: 200, h: 100 } },
    ]);
</script>
```

---

## Controlled API

`GridItem` is controlled through `v-model`. Keep your layout in application state and let `GridItem` emit updates while dragging, resizing, or using keyboard controls.

```vue
<Grid :layout="layout">
    <GridItem
        v-for="item in layout"
        :key="item.id"
        :nodeId="item.id"
        v-model="item.grid"
    />
</Grid>
```

`Grid :layout` is the preferred collision context API. `GridItem :allNodes` is deprecated and kept only for backward compatibility.

---

## Accessibility

Grid items are focusable by default.

- `Enter` / `Space`: activate the focused item
- Arrow keys: move the item by one grid cell
- `Shift` + arrow keys: resize the item by one grid cell
- `ariaLabel`: provide a readable label when `nodeId` is not meaningful

## API at a Glance

### `<Grid>` Component

- **Props**
    - `gridCellSize`: number (default `50`) – Size (in px) for each grid cell.
    - `layout`: GridNode[] – Items used by nested `<GridItem>` components for collision detection.
- **Slots**
    - Default slot for placing `<GridItem>` components.

### `<GridItem>` Component

- **Key Props**

    - `nodeId`: Unique ID (required).
    - `x`, `y`, `w`, `h`: Position & size in pixels.
    - `draggable`, `resizable`, `freeDrag`, etc.
    - `allNodes`: Deprecated optional override for collision detection. Prefer passing `layout` to the parent `<Grid>`.
    - `focusable`, `ariaLabel`: Keyboard focus, arrow-key movement, and accessible naming.
    - `modelValue`: Reactive object `{ x, y, w, h }` (for `v-model`).

- **Key Events**
    - `dragStart`, `dragStop`, `resizeStart`, `resizeStop`, `collisionDetected`, etc.

---

## More Examples

1. **Resizable Items**

    ```vue
    <Grid :gridCellSize="50">
      <GridItem :resizable="true" :minWidth="100" :maxWidth="300" ...>
        ...
      </GridItem>
    </Grid>
    ```

2. **Collision Detection**

    ```vue
    <Grid :layout="items">
      <GridItem @collision-detected="handleCollision" ... />
    </Grid>
    ```

3. **Free Dragging**
    ```vue
    <GridItem :freeDrag="true" ... />
    ```

For a deeper dive, see the **[Full Documentation](https://frankiesr.github.io/VueGridle/)**.

---

## Development

```bash
npm run test
npm run build
npm run docs:build
```

---

## Contributing

Issues and pull requests are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a larger change.

Security issues should be reported privately. See [SECURITY.md](./SECURITY.md).

---

## License

MIT. See [LICENSE](./LICENSE).

**Enjoy building dynamic, interactive grids with `VueGridle`!**  
Contributions & feedback welcome.
