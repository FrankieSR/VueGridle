![VueGridle Banner](./public/logo.png)

# VueGridle 🚀 - Vue 3 Grid System

`VueGridle` is a small, typed, and flexible grid library for Vue 3.  
Built with TypeScript and Composition API for smooth, dynamic layouts.

---

[![npm version](https://badge.fury.io/js/vuegridle.svg)](https://www.npmjs.com/package/vuegridle)
[![Bundlephobia](https://img.shields.io/bundlephobia/minzip/vuegridle)](https://bundlephobia.com/package/vuegridle)
[![Downloads](https://img.shields.io/npm/dt/vuegridle.svg)](https://www.npmjs.com/package/vuegridle)
[![License](https://img.shields.io/npm/l/vuegridle.svg)](https://github.com/FrankieSR/VueGridle/blob/main/LICENSE)

---

## Features 🌟

- 🖱️ **Drag & Drop Grid Snapping** – Snap items to the grid for precise layouts.
- 🌍 **Free Movement Drag** – Enjoy optional free-form dragging without grid constraints.
- 📏 **Resizable** – Easily resize items with min/max limits for perfect control.
- ⚠️ **Collision Detection** – Get real-time alerts when items overlap.
- 🛠️ **TypeScript** – Strictly typed for cleaner code and fewer bugs.
- 🎨 **Customizable** – Tweak everything via props, events, and CSS variables.

---

## Installation ⚡

### Prerequisites

- Vue 3.x
- Node.js 18+ (recommended)

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

    const layout = ref([
        { id: 'item-1', grid: { x: 0, y: 0, w: 200, h: 100 } },
        { id: 'item-2', grid: { x: 50, y: 50, w: 200, h: 100 } },
    ]);
</script>
```

---

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

For a deeper dive (including advanced collision handling, dynamic layouts, styling tips, etc.), see the **[Full Documentation](https://frankiesr.github.io/VueGridle/)**.

---

## License

`VueGridle` is released under the [MIT License](./LICENSE).

---

**Enjoy building dynamic, interactive grids with `VueGridle`!**  
Contributions & feedback welcome.
