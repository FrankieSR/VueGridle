# vueBlocks - Flexible Grid Layout Library for Vue 3

`vueBlocks` is a powerful and flexible grid layout library for Vue 3, designed to create interactive layouts with draggable and resizable items. Built with TypeScript and Composition API, it provides a robust solution for building dynamic dashboards, editors, or any application requiring grid-based interactions.

## Features

- **Draggable Items**: Move items freely or snap them to a grid.
- **Resizable Items**: Resize items with minimum and maximum constraints.
- **Collision Detection**: Detect and handle collisions between items.
- **TypeScript Support**: Fully typed for a seamless development experience.
- **Customizable**: Extensive props and events for fine-tuned control.

---

## Installation

### Prerequisites

- Vue 3.x
- Node.js 18+ (recommended)

### Install via npm

### Add to Your Project

Import and register the components in your Vue application:

    // main.ts
    import { createApp } from 'vue';
    import App from './App.vue';
    import { Grid, GridItem } from 'vueBlocks';

    const app = createApp(App);
    app.component('Grid', Grid);
    app.component('GridItem', GridItem);
    app.mount('#app');

---

## Components

### <Grid>

The container component that defines the grid layout.

### Props

| Prop           | Type     | Default | Description                                   |
| -------------- | -------- | ------- | --------------------------------------------- |
| `gridCellSize` | `number` | 50      | Size of each grid cell in pixels (snap step). |

#### Slots

- **default**: Content to be rendered inside the grid (typically `<GridItem>` components).

#### Example

    <template>
      <Grid :gridCellSize="50">
        <!-- Grid items go here -->
      </Grid>
    </template>

    <script lang="ts" setup>
    import { Grid } from 'vueBlocks';
    </script>

### <GridItem>

The individual item component within the grid, supporting drag and resize functionality.

| Prop         | Type         | Default  | Description                                   |
| ------------ | ------------ | -------- | --------------------------------------------- |
| `x`          | `number`     | 0        | Initial X position of the item.               |
| `y`          | `number`     | 0        | Initial Y position of the item.               |
| `w`          | `number`     | 100      | Initial width of the item in pixels.          |
| `h`          | `number`     | 100      | Initial height of the item in pixels.         |
| `freeDrag`   | `boolean`    | false    | Allow free movement without snapping to grid. |
| `resizable`  | `boolean`    | true     | Enable resizing of the item.                  |
| `draggable`  | `boolean`    | true     | Enable dragging of the item.                  |
| `nodeId`     | `string`     | ''       | Unique identifier for the item.               |
| `allNodes`   | `GridNode[]` | []       | Array of all items for collision detection.   |
| `modelValue` | `Rect`       | Required | Current position and size (`{ x, y, w, h }`). |
| `minWidth`   | `number`     | 50       | Minimum width of the item in pixels.          |
| `minHeight`  | `number`     | 50       | Minimum height of the item in pixels.         |
| `maxWidth`   | `number`     | 500      | Maximum width of the item in pixels.          |
| `maxHeight`  | `number`     | 500      | Maximum height of the item in pixels.         |

#### Events

Event

Arguments

Description

`dragStart`

\-

Emitted when dragging starts.

`drag`

`(x: number, y: number)`

Emitted during dragging with new coordinates.

`dragStop`

`(x: number, y: number)`

Emitted when dragging stops.

`resizeStart`

\-

Emitted when resizing starts.

`resize`

`(x: number, y: number, w: number, h: number)`

Emitted during resizing with new dimensions.

`resizeStop`

`(x: number, y: number, w: number, h: number)`

Emitted when resizing stops.

`update:modelValue`

`(value: Rect)`

Emitted to update the item's position and size.

`itemActivated`

`(nodeId: string)`

Emitted when the item is clicked and activated.

`itemDeactivated`

`(nodeId: string)`

Emitted when the item is deactivated.

`drop`

`(nodeId: string, x: number, y: number)`

Emitted when dragging stops with final position.

`collisionDetected`

`(collidingIds: string[])`

Emitted when the item collides with others.

#### Slots

- **default**: Content to be rendered inside the grid item.

#### Example

    <template>
      <Grid :gridCellSize="50">
        <GridItem
          v-for="item in layout"
          :key="item.id"
          :nodeId="item.id"
          :x="item.grid.x"
          :y="item.grid.y"
          :w="item.grid.w"
          :h="item.grid.h"
          :minWidth="100"
          :minHeight="80"
          :maxWidth="300"
          :maxHeight="250"
          :allNodes="layout"
          v-model="item.grid"
          @drag-start="onDragStart(item.id)"
          @drag="(x, y) => onDrag(item.id, x, y)"
          @drag-stop="(x, y) => onDragStop(item.id, x, y)"
          @resize-start="onResizeStart(item.id)"
          @resize="(x, y, w, h) => onResize(item.id, x, y, w, h)"
          @resize-stop="(x, y, w, h) => onResizeStop(item.id, x, y, w, h)"
          @update:model-value="(value) => onUpdate(item.id, value)"
          @collision-detected="(ids) => onCollision(item.id, ids)"
        >
          <div>{{ item.id }}</div>
        </GridItem>
      </Grid>
    </template>

    <script lang="ts" setup>
    import { ref } from 'vue';
    import { Grid, GridItem } from 'vueBlocks';

    const layout = ref([
      { id: 'item-1', grid: { x: 50, y: 50, w: 200, h: 100 } },
      { id: 'item-2', grid: { x: 300, y: 200, w: 200, h: 100 } },
    ]);

    const onDragStart = (id: string) => console.log(`[${id}] Drag started`);
    const onDrag = (id: string, x: number, y: number) => console.log(`[${id}] Dragging to x: ${x}, y: ${y}`);
    const onDragStop = (id: string, x: number, y: number) => console.log(`[${id}] Drag stopped at x: ${x}, y: ${y}`);
    const onResizeStart = (id: string) => console.log(`[${id}] Resize started`);
    const onResize = (id: string, x: number, y: number, w: number, h: number) => console.log(`[${id}] Resizing to x: ${x}, y: ${y}, w: ${w}, h: ${h}`);
    const onResizeStop = (id: string, x: number, y: number, w: number, h: number) => console.log(`[${id}] Resize stopped at x: ${x}, y: ${y}, w: ${w}, h: ${h}`);
    const onUpdate = (id: string, value: any) => console.log(`[${id}] Updated to:`, value);
    const onCollision = (id: string, collidingIds: string[]) => console.log(`[${id}] Collided with: ${collidingIds.join(', ')}`);
    </script>

---

## Usage Examples

### Basic Grid with Draggable Items

    <template>
      <Grid :gridCellSize="50">
        <GridItem
          v-for="item in items"
          :key="item.id"
          :nodeId="item.id"
          :x="item.grid.x"
          :y="item.grid.y"
          :w="item.grid.w"
          :h="item.grid.h"
          :allNodes="items"
          v-model="item.grid"
        >
          <div>{{ item.id }}</div>
        </GridItem>
      </Grid>
    </template>

    <script lang="ts" setup>
    import { ref } from 'vue';
    import { Grid, GridItem } from 'vueBlocks';

    const items = ref([
      { id: 'item-1', grid: { x: 0, y: 0, w: 200, h: 100 } },
      { id: 'item-2', grid: { x: 250, y: 150, w: 200, h: 100 } },
    ]);
    </script>

    <style>
    .grid-container {
      width: 800px;
      height: 600px;
      border: 1px solid #ccc;
    }
    </style>

### Grid with Resizable Items and Size Constraints

    <template>
      <Grid :gridCellSize="50">
        <GridItem
          v-for="item in items"
          :key="item.id"
          :nodeId="item.id"
          :x="item.grid.x"
          :y="item.grid.y"
          :w="item.grid.w"
          :h="item.grid.h"
          :minWidth="100"
          :minHeight="80"
          :maxWidth="300"
          :maxHeight="250"
          :allNodes="items"
          v-model="item.grid"
        >
          <div>{{ item.id }}</div>
        </GridItem>
      </Grid>
    </template>

    <script lang="ts" setup>
    import { ref } from 'vue';
    import { Grid, GridItem } from 'vueBlocks';

    const items = ref([
      { id: 'item-1', grid: { x: 0, y: 0, w: 200, h: 100 } },
      { id: 'item-2', grid: { x: 250, y: 150, w: 200, h: 100 } },
    ]);
    </script>

### Handling Collisions

    <template>
      <Grid :gridCellSize="50">
        <GridItem
          v-for="item in items"
          :key="item.id"
          :nodeId="item.id"
          :x="item.grid.x"
          :y="item.grid.y"
          :w="item.grid.w"
          :h="item.grid.h"
          :allNodes="items"
          v-model="item.grid"
          @collision-detected="onCollision"
        >
          <div>{{ item.id }}</div>
        </GridItem>
      </Grid>
    </template>

    <script lang="ts" setup>
    import { ref } from 'vue';
    import { Grid, GridItem } from 'vueBlocks';

    const items = ref([
      { id: 'item-1', grid: { x: 0, y: 0, w: 200, h: 100 } },
      { id: 'item-2', grid: { x: 150, y: 50, w: 200, h: 100 } },
    ]);

    const onCollision = (collidingIds: string[]) => {
      console.log('Collision detected with:', collidingIds);
      // Your logic here
    };
    </script>

### Free Dragging Without Grid Snap

    <template>
      <Grid :gridCellSize="50">
        <GridItem
          v-for="item in items"
          :key="item.id"
          :nodeId="item.id"
          :x="item.grid.x"
          :y="item.grid.y"
          :w="item.grid.w"
          :h="item.grid.h"
          :freeDrag="true"
          :allNodes="items"
          v-model="item.grid"
        >
          <div>{{ item.id }}</div>
        </GridItem>
      </Grid>
    </template>

    <script lang="ts" setup>
    import { ref } from 'vue';
    import { Grid, GridItem } from 'vueBlocks';

    const items = ref([
      { id: 'item-1', grid: { x: 0, y: 0, w: 200, h: 100 } },
      { id: 'item-2', grid: { x: 250, y: 150, w: 200, h: 100 } },
    ]);
    </script>

---

## API Reference

### Types

#### `Rect`

    interface Rect {
      x: number;
      y: number;
      w: number;
      h: number;
    }

Represents the position and size of a grid item.

#### `GridNode`

    interface GridNode {
      id: string;
      grid: Rect;
    }

Represents an item in the grid with its unique ID and dimensions.

---

## Tips & Best Practices

- **Grid Size**: Ensure the `Grid` container has a defined `width` and `height` to avoid unexpected behavior. Example:

                              .grid-container {
                                width: 800px;
                                height: 600px;
                              }

- **Collision Handling**: Use the `collisionDetected` event to implement custom logic, such as snapping items back or highlighting collisions:

                              const onCollision = (collidingIds: string[]) => {
                                alert(`Collision with: ${collidingIds.join(', ')}`);
                              };

- **Styling**: Customize the appearance using CSS variables defined in your theme:

                              :root {
                                --grid-cell-size: 50px;
                                --grid-item-bg-color: #f0f0f0;
                                --grid-line-color: #ddd;
                              }

---

## License

`vueBlocks` is licensed under the MIT License.
