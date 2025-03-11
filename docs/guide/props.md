---
outline: deep
---

# Props

This section provides a detailed overview of all available props for the `Grid` and `GridItem`  components. These props control the appearance, behavior, and constraints of individual items within a `Grid`.

## `<Grid>`

The container component that defines the grid layout and provides context for its child `GridItem` components.

### Props

| Prop            | Type    | Default | Description                              |
|-----------------|---------|---------|------------------------------------------|
| `gridCellSize`  | `Number`| `50`    | The size (in pixels) of each grid cell.  |


#### `gridCellSize`
- **Type**: `Number`
- **Default**: `50`
- **Description**: Determines the size of each cell in the grid (in pixels). This affects the snapping behavior of `GridItem` components when `freeDrag` is `false`. Smaller values allow finer grid increments, while larger values create a coarser grid.
- **Example**:
  ```vue
  <Grid :gridCellSize="25">
    <GridItem nodeId="item-1" :x="0" :y="0" :w="200" :h="100" />
  </Grid>
  ```

---

## `<GridItem>`

Below is a comprehensive list of props supported by the `GridItem` component, including their types, default values, and detailed explanations.

### Props

| Prop         | Type         | Default      | Description                                                                                                |
| ------------ | ------------ | ------------ | ---------------------------------------------------------------------------------------------------------- |
| `x`          | `Number`     | `0`          | The initial x-coordinate of the item (in pixels or grid units).                   |
| `y`          | `Number`     | `0`          | The initial y-coordinate of the item (in pixels or grid units).                   |
| `w`          | `Number`     | `200`        | The initial width of the item (in pixels or grid units).                          |
| `h`          | `Number`     | `100`        | The initial height of the item (in pixels or grid units).                         |
| `z`          | `Number`     | `1`          | The z-index of the item, determining its stacking order within the grid.                                   |
| `proximity`  | `Number`     | `150`        | The distance (<= in pixels) at which the item is considered "near" an active item.                            |
| `freeDrag`   | `Boolean`    | `false`      | Enables free dragging, disabling grid snapping for more fine-grained control.                                      |
| `resizable`  | `Boolean`    | `false`      | Enables resizing of the item via corner handles.                                                           |
| `draggable`  | `Boolean`    | `false`      | Enables dragging of the item within the grid.                                                              |
| `nodeId`     | `String`     | **Required** | A unique identifier for the item, used for tracking and collision detection.                               |
| `allNodes`   | `GridNode[]` | **Required** | An array of all grid items (`GridNode` objects) for collision detection and layout management.             |
| `modelValue` | `Rect`       | **Required** | A reactive object `{ x: number, y: number, w: number, h: number }` for two-way data binding via `v-model`. |
| `minWidth`   | `Number`     | `undefined`  | The minimum width (in pixels) the item can be resized to. Defaults to 50 if not specified.                 |
| `minHeight`  | `Number`     | `undefined`  | The minimum height (in pixels) the item can be resized to. Defaults to 50 if not specified.                |
| `maxWidth`   | `Number`     | `undefined`  | The maximum width (in pixels) the item can be resized to. Limited by grid boundaries if unspecified.       |
| `maxHeight`  | `Number`     | `undefined`  | The maximum height (in pixels) the item can be resized to. Limited by grid boundaries if unspecified.      |
| `isNearActive`| `Boolean` | `Computed`   | Indicates whether the item is near an active item (within `proximity` distance). Available via slot scope. |
---

## Prop Details

### `x`, `y`, `w`, `h`

- **Type**: `Number`
- **Default**: `x: 0`, `y: 0`, `w: 200`, `h: 100`
- **Description**: These props define the initial position (`x`, `y`) and size (`w`, `h`) of the `GridItem`. When `freeDrag` is `false`, values snap to the grid based on the `gridCellSize` defined in the parent `Grid`. When `freeDrag` is `true`, they are treated as pixel values without snapping.
- **Example**:
    ```vue
    <GridItem :x="50" :y="100" :w="200" :h="150" nodeId="item-1" />
    ```

### `z`

- **Type**: `Number`
- **Default**: `1`
- **Description**: Controls the stacking order of the item within the grid. Higher values place the item above others. Useful for ensuring draggable or active items appear on top.
- **Example**:
    ```vue
    <GridItem :z="2" nodeId="item-1" />
    ```

### `proximity`

- **Type**: `Number`
- **Default**: `150`
- **Description**: Defines the radius (in pixels) within which the item is considered "near" the active item, affecting the `isNearActive` state. This can be used for visual feedback or custom interactions.
- **Example**:
    ```vue
    <GridItem :proximity="200" nodeId="item-1" />
    ```

### `freeDrag`

- **Type**: `Boolean`
- **Default**: `false`
- **Description**: When `true`, the item can be dragged freely without snapping to the grid. This overrides the `gridCellSize` snapping behavior, allowing pixel-perfect positioning.
- **Example**:
    ```vue
    <GridItem :freeDrag="true" nodeId="free-item" />
    ```

### `resizable`

- **Type**: `Boolean`
- **Default**: `false`
- **Description**: Enables resize handles on the corners of the item, allowing users to adjust its width and height interactively. Resizing respects `minWidth`, `minHeight`, `maxWidth`, and `maxHeight` constraints.
- **Example**:
    ```vue
    <GridItem :resizable="true" nodeId="item-1" />
    ```

### `draggable`

- **Type**: `Boolean`
- **Default**: `false`
- **Description**: Enables dragging of the item within the grid. When combined with `freeDrag`, dragging is unrestricted; otherwise, it snaps to the grid.
- **Example**:
    ```vue
    <GridItem :draggable="true" nodeId="item-1" />
    ```

### `nodeId`

- **Type**: `String`
- **Default**: **Required**
- **Description**: A unique identifier for the `GridItem`. This is critical for tracking the item within the grid, managing its state, and detecting collisions with other items.
- **Example**:
    ```vue
    <GridItem nodeId="item-1" />
    ```

### `allNodes`

- **Type**: `GridNode[]`
- **Default**: **Required**
- **Description**: An array of all `GridNode` objects in the grid, where each object contains `{ id: string, grid: Rect, freeDrag?: boolean, z?: number }`. This prop is used for collision detection and ensuring items don’t overlap (unless `freeDrag` is enabled).
- **Example**:
    ```vue
    <GridItem :allNodes="layout" nodeId="item-1" />
    ```
    ```ts
    const layout = [
        { id: 'item-1', grid: { x: 0, y: 0, w: 200, h: 100 } },
        { id: 'item-2', grid: { x: 250, y: 0, w: 200, h: 100 } },
    ];
    ```

### `modelValue`

- **Type**: `Rect`
- **Default**: **Required**
- **Description**: A reactive object with the structure `{ x: number, y: number, w: number, h: number }` that represents the current position and size of the item. Use with `v-model` for two-way data binding. Updated via the `update:modelValue` event when the item is dragged or resized.
- **Example**:
    ```vue
    <GridItem v-model="item.grid" nodeId="item-1" />
    ```
    ```ts
    const item = ref({ id: 'item-1', grid: { x: 0, y: 0, w: 200, h: 100 } });
    ```

### `minWidth`, `minHeight`

- **Type**: `Number`
- **Default**: `undefined` (falls back to `50` internally)
- **Description**: Set the minimum width and height (in pixels) the item can be resized to. Prevents the item from becoming too small during resizing.
- **Example**:
    ```vue
    <GridItem :minWidth="100" :minHeight="80" :resizable="true" nodeId="item-1" />
    ```

### `maxWidth`, `maxHeight`

- **Type**: `Number`
- **Default**: `undefined` (limited by grid boundaries)
- **Description**: Set the maximum width and height (in pixels) the item can be resized to. If unspecified, the grid’s dimensions act as the upper limit.
- **Example**:
    ```vue
    <GridItem :maxWidth="300" :maxHeight="200" :resizable="true" nodeId="item-1" />
    ```

### `isNearActive`
- **Type**: `Boolean`
- **Default**: Computed internally based on `proximity` and the position of the active item.
- **Description**: A read-only computed property exposed through the default slot scope (`{ isNearActive }`). It becomes `true` when the item is within the `proximity` distance (in pixels) of the currently active (dragged or resized) item, as determined by the grid context. This prop is useful for triggering visual feedback or custom logic when items are close to each other without colliding.
- **Example**:
  ```vue
  <Grid :gridCellSize="50">
    <GridItem
      v-for="item in layout"
      :key="item.id"
      :nodeId="item.id"
      :x="item.grid.x"
      :y="item.grid.y"
      :w="item.grid.w"
      :h="item.grid.h"
      :allNodes="layout"
      :draggable="true"
      :proximity="150"
      v-model="item.grid"
    >
      <template #default="{ isNearActive }">
        <div class="grid-item-content">
          {{ isNearActive ? 'Near me! 🎈' : item.label }}
        </div>
      </template>
    </GridItem>
  </Grid>

---

## Usage Tips

- **Positioning**: Use `x` and `y` to place items initially, and rely on `modelValue` for dynamic updates during dragging or resizing.
- **Constraints**: Combine `minWidth`, `minHeight`, `maxWidth`, and `maxHeight` to enforce size limits tailored to your use case.
- **Free Dragging**: Enable `freeDrag` for pixel-perfect control, but note that collision detection may still apply unless explicitly disabled in your logic.
- **Collision Detection**: Ensure `allNodes` includes all items in the grid to accurately detect overlaps and emit `collision-detected` events.

This guide covers all props for the `Grid` and `GridItem` components, providing a foundation for building flexible and interactive grid layouts.
