---
outline: deep
---

# Events

This section details all events emitted by the `GridItem` and `Grid` components. These events allow you to respond to user interactions such as dragging, resizing, activation, and collisions within the grid.

## Event Reference

Below is a comprehensive list of events supported by the `GridItem` and `Grid` components, including their payloads and descriptions.

### `<GridItem>` Events

| Event              | Payload                          | Description                                                                 |
|--------------------|----------------------------------|---------------------------------------------------------------------|
| `drag-start`       | -                                | Emitted when the user starts dragging the item.                     |
| `drag`             | `(x: number, y: number)`         | Emitted continuously during dragging, providing the current position.|
| `drag-stop`        | `(x: number, y: number)`         | Emitted when dragging stops, providing the final position.          |
| `resize-start`     | -                                | Emitted when the user starts resizing the item.                     |
| `resize`           | `(x: number, y: number, w: number, h: number)` | Emitted continuously during resizing, providing the current position and size. |
| `resize-stop`      | `(x: number, y: number, w: number, h: number)` | Emitted when resizing stops, providing the final position and size. |
| `update:modelValue`| `{ x: number, y: number, w: number, h: number }` | Emitted when the item's position or size updates, typically used with `v-model`. |
| `item-activated`   | `nodeId: string`                 | Emitted when the item becomes active (e.g., clicked).               |
| `item-deactivated` | `nodeId: string`                 | Emitted when the item is deactivated (e.g., another item is clicked or clicked outside). |
| `drop`             | `(nodeId: string, x: number, y: number)` | Emitted when the item is dropped after dragging.            |
| `collision-detected`| `collidingIds: string[]`        | Emitted when the item overlaps with other items, listing their IDs. |

### `<Grid>` Events

| Event              | Payload                          | Description                                                                 |
|--------------------|----------------------------------|---------------------------------------------------------------------|
| *(None)*           | -                                | Currently, the `Grid` component does not emit any custom events.     |

---

## Event Details

### `<GridItem>` Events

#### `drag-start`
- **Payload**: None
- **Description**: Fired when the user begins dragging the item. Useful for initializing drag-related state or UI changes.
- **Example**:
  ```vue
  <GridItem @drag-start="onDragStart('item-1')" nodeId="item-1" draggable />
  ```
  ```ts
  const onDragStart = (nodeId: string) => {
      console.log(`[${nodeId}] Drag started`);
  };
  ```

#### `drag`
- **Payload**: `(x: number, y: number)`
- **Description**: Emitted repeatedly during dragging, providing the current x and y coordinates of the item. Useful for real-time tracking or visual feedback.
- **Example**:
  ```vue
  <GridItem @drag="(x, y) => onDrag('item-1', x, y)" nodeId="item-1" draggable />
  ```
  ```ts
  const onDrag = (nodeId: string, x: number, y: number) => {
      console.log(`[${nodeId}] Dragging to x: ${x}, y: ${y}`);
  };
  ```

#### `drag-stop`
- **Payload**: `(x: number, y: number)`
- **Description**: Fired when dragging ends, providing the final x and y coordinates. Useful for updating the item's position in your data model.
- **Example**:
  ```vue
  <GridItem @drag-stop="(x, y) => onDragStop('item-1', x, y)" nodeId="item-1" draggable />
  ```
  ```ts
  const onDragStop = (nodeId: string, x: number, y: number) => {
      console.log(`[${nodeId}] Drag stopped at x: ${x}, y: ${y}`);
  };
  ```

#### `resize-start`
- **Payload**: None
- **Description**: Fired when the user begins resizing the item. Useful for initializing resize-related state or UI changes.
- **Example**:
  ```vue
  <GridItem @resize-start="onResizeStart('item-1')" nodeId="item-1" resizable />
  ```
  ```ts
  const onResizeStart = (nodeId: string) => {
      console.log(`[${nodeId}] Resize started`);
  };
  ```

#### `resize`
- **Payload**: `(x: number, y: number, w: number, h: number)`
- **Description**: Emitted repeatedly during resizing, providing the current position (x, y) and size (w, h) of the item. Useful for real-time tracking or visual feedback.
- **Example**:
  ```vue
  <GridItem @resize="(x, y, w, h) => onResize('item-1', x, y, w, h)" nodeId="item-1" resizable />
  ```
  ```ts
  const onResize = (nodeId: string, x: number, y: number, w: number, h: number) => {
      console.log(`[${nodeId}] Resizing to x: ${x}, y: ${y}, w: ${w}, h: ${h}`);
  };
  ```

#### `resize-stop`
- **Payload**: `(x: number, y: number, w: number, h: number)`
- **Description**: Fired when resizing ends, providing the final position and size. Useful for updating the item's dimensions in your data model.
- **Example**:
  ```vue
  <GridItem @resize-stop="(x, y, w, h) => onResizeStop('item-1', x, y, w, h)" nodeId="item-1" resizable />
  ```
  ```ts
  const onResizeStop = (nodeId: string, x: number, y: number, w: number, h: number) => {
      console.log(`[${nodeId}] Resize stopped at x: ${x}, y: ${y}, w: ${w}, h: ${h}`);
  };
  ```

#### `update:modelValue`
- **Payload**: `{ x: number, y: number, w: number, h: number }`
- **Description**: Emitted whenever the item’s position or size changes (e.g., during drag or resize), typically used with `v-model` for two-way data binding.
- **Example**:
  ```vue
  <GridItem v-model="item.grid" @update:model-value="onUpdateModelValue('item-1', $event)" nodeId="item-1" />
  ```
  ```ts
  const onUpdateModelValue = (nodeId: string, value: { x: number; y: number; w: number; h: number }) => {
      console.log(`[${nodeId}] Model updated to x: ${value.x}, y: ${value.y}, w: ${value.w}, h: ${value.h}`);
  };
  ```

#### `item-activated`
- **Payload**: `nodeId: string`
- **Description**: Fired when the item becomes active (e.g., clicked). Only one item can be active at a time within the grid.
- **Example**:
  ```vue
  <GridItem @item-activated="onItemActivated('item-1')" nodeId="item-1" />
  ```
  ```ts
  const onItemActivated = (nodeId: string) => {
      console.log(`[${nodeId}] Item activated`);
  };
  ```

#### `item-deactivated`
- **Payload**: `nodeId: string`
- **Description**: Fired when the item is deactivated (e.g., another item is clicked or the user clicks outside the grid).
- **Example**:
  ```vue
  <GridItem @item-deactivated="onItemDeactivated('item-1')" nodeId="item-1" />
  ```
  ```ts
  const onItemDeactivated = (nodeId: string) => {
      console.log(`[${nodeId}] Item deactivated`);
  };
  ```

#### `drop`
- **Payload**: `(nodeId: string, x: number, y: number)`
- **Description**: Emitted when the item is dropped after dragging, providing its final position and ID. Often used in conjunction with `drag-stop`.
- **Example**:
  ```vue
  <GridItem @drop="(nodeId, x, y) => onDrop(nodeId, x, y)" nodeId="item-1" draggable />
  ```
  ```ts
  const onDrop = (nodeId: string, x: number, y: number) => {
      console.log(`[${nodeId}] Dropped at x: ${x}, y: ${y}`);
  };
  ```

#### `collision-detected`
- **Payload**: `collidingIds: string[]`
- **Description**: Fired when the item overlaps with other items in the grid, providing an array of colliding item IDs. Requires the `allNodes` prop to be set.
- **Example**:
  ```vue
  <GridItem @collision-detected="onCollisionDetected('item-1', $event)" nodeId="item-1" :allNodes="layout" />
  ```
  ```ts
  const onCollisionDetected = (nodeId: string, collidingIds: string[]) => {
      console.log(`[${nodeId}] Collision detected with: ${collidingIds}`);
  };
  ```

### `<Grid>` Events

#### *(None)*
- **Description**: The `Grid` component currently does not emit any custom events. It serves as a container and context provider for `GridItem` components. Future updates may introduce events for grid-wide interactions.

---

## Usage Tips

- **Real-Time Feedback**: Use `drag` and `resize` events for live updates to the UI or data, while `drag-stop` and `resize-stop` are ideal for finalizing changes.
- **Activation Handling**: Combine `item-activated` and `item-deactivated` to manage focus or highlight states within the grid.
- **Collision Management**: Leverage `collision-detected` to implement custom overlap behaviors, such as snapping items apart or showing warnings.
- **Model Syncing**: Use `update:modelValue` with `v-model` to keep your data in sync with the item’s position and size without manual event handling.

This guide covers all events for the `GridItem` and `Grid` components, enabling you to build responsive and interactive grid layouts.

