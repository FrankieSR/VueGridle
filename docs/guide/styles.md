---
outline: deep
---

# Styles

This section explains the styling system for the `Grid` and `GridItem` components. Styles are defined using CSS variables for flexibility and can be customized by overriding these variables in your own stylesheets. The default design uses a calm, professional palette suitable for modern applications.

## CSS Variables

All styles are driven by global CSS variables defined in the `:root` scope. These variables can be overridden in your own `:root` or a higher-specificity selector to customize the appearance of the grid system.

### Example of Overriding

```css
:root {
    --grid-bg-color: #1a1e24;
    --grid-item-bg-color: rgba(70, 80, 90, 0.9);
    --grid-item-border-color: #ff6b6b;
}
```

### Variable Reference

| Variable                             | Default Value                          | Description                                                           |
| ------------------------------------ | -------------------------------------- | --------------------------------------------------------------------- |
| `--grid-bg-color`                    | `#1e2229`                              | Background color of the grid container.                               |
| `--grid-active-bg-color`             | `rgba(30, 34, 41, 0.95)`               | Background color when the grid is active (e.g., during manipulation). |
| `--grid-line-color`                  | `rgba(255, 255, 255, 0.08)`            | Color of the grid lines when active.                                  |
| `--grid-item-border-color`           | `#89b4fa`                              | Border color for grid items, used for highlights and active states.   |
| `--grid-item-bg-color`               | `rgba(42, 48, 56, 0.85)`               | Background color of grid items.                                       |
| `--resize-handle-bg-color`           | `#6ee7b7`                              | Background color of resize handles.                                   |
| `--grid-item-shadow`                 | `0 6px 16px rgba(0, 0, 0, 0.12)`       | Default shadow for grid items.                                        |
| `--grid-item-dragging-shadow`        | `0 8px 20px rgba(137, 180, 250, 0.3)`  | Shadow applied when dragging an item.                                 |
| `--grid-item-resizing-shadow`        | `0 6px 18px rgba(110, 231, 183, 0.3)`  | Shadow applied when resizing an item.                                 |
| `--grid-active-inner-shadow`         | `inset 0 2px 10px rgba(0, 0, 0, 0.06)` | Inner shadow for the active grid container.                           |
| `--grid-item-active-shadow`          | `0 6px 16px rgba(137, 180, 250, 0.25)` | Shadow for an active grid item.                                       |
| `--grid-cell-size`                   | `50px`                                 | Size of each grid cell (This is the default value, and this variable is automatically adjusted based on the [gridCellSize](/guide/props#gridcellsize) prop).  |
| `--resize-handle-size`               | `12px`                                 | Size of resize handles.                                               |
| `--resize-handle-offset`             | `-6px`                                 | Offset of resize handles from the item’s edges.                       |
| `--grid-transition`                  | `all 0.1s ease-in-out`                 | Transition timing for the grid container.                             |
| `--grid-item-transition`             | `all 0.1s ease`                        | Transition timing for grid items.                                     |
| `--resize-handle-transition`         | `all 0.1s ease-out`                    | Transition timing for resize handles.                                 |
| `--grid-item-dragging-opacity`       | `0.98`                                 | Opacity of a grid item while dragging.                                |
| `--resize-handle-opacity`            | `0.6`                                  | Default opacity of resize handles.                                    |
| `--resize-handle-hover-opacity`      | `0.9`                                  | Opacity of resize handles on hover.                                   |
| `--grid-item-dragging-scale`         | `1.03`                                 | Scale factor applied to a grid item while dragging.                   |
| `--resize-handle-hover-scale`        | `1.15`                                 | Scale factor for resize handles on hover.                             |
| `--grid-item-hover-lift`             | `-2px`                                 | Vertical lift (translateY) for grid items on hover.                   |
| `--grid-item-cursor`                 | `grab`                                 | Cursor style for draggable grid items.                                |
| `--grid-item-dragging-cursor`        | `grabbing`                             | Cursor style while dragging a grid item.                              |
| `--resize-handle-z-index`            | `10`                                   | Z-index of resize handles to ensure they stay above the item.         |
| `--resize-handle-border-radius`      | `50%`                                  | Border radius of resize handles (circular by default).                |
| `--grid-item-highlight-border-width` | `2px`                                  | Width of the highlight border for grid items.                         |
| `--grid-item-highlight-border-style` | `dashed`                               | Style of the highlight border for grid items.                         |
| `--grid-item-active-border-width`    | `1px`                                  | Width of the border for active grid items.                            |
| `--grid-item-active-border-style`    | `solid`                                | Style of the border for active grid items.                            |

---

## Class Styles

The following CSS classes are applied to the `Grid` and `GridItem` components to define their appearance and behavior.

### `.vueblocks-grid-container`

- **Description**: The main container for the grid, providing the layout context.
- **Styles**:
    - `position: relative`: Ensures absolute positioning of child items works correctly.
    - `width: 100%`, `height: 100%`: Fills its parent container.
    - `background-color: var(--grid-bg-color)`: Sets the default background.
    - `transition: var(--grid-transition)`: Smooth transitions for background changes.

### `.vueblocks-grid-active`

- **Description**: Applied to the grid container when it’s in an active state (e.g., during dragging or resizing).
- **Styles**:
    - `background: var(--grid-active-bg-color)`: Changes the background color.
    - `background-image`: Adds a grid pattern using linear gradients based on `--grid-cell-size`.
    - `box-shadow: var(--grid-active-inner-shadow)`: Adds an inner shadow for depth.

### `.vueblocks-grid-item`

- **Description**: The base class for each grid item.
- **Styles**:
    - `position: absolute`: Allows positioning within the grid.
    - `background-color: var(--grid-item-bg-color)`: Sets the item’s background.
    - `cursor: var(--grid-item-cursor)`: Default cursor for dragging.
    - `transition: var(--grid-item-transition)`: Smooth transitions for transforms and shadows.
    - `user-select: none`: Prevents text selection during interaction.

### `.vueblocks-grid-item:hover`

- **Description**: Applied when hovering over a grid item.
- **Styles**:
    - `box-shadow: var(--grid-item-shadow)`: Adds a subtle shadow.
    - `transform: translateY(var(--grid-item-hover-lift))`: Lifts the item slightly.

### `.vueblocks-dragging`

- **Description**: Applied to a grid item while it’s being dragged.
- **Styles**:
    - `opacity: var(--grid-item-dragging-opacity)`: Slightly reduces opacity.
    - `cursor: var(--grid-item-dragging-cursor)`: Changes cursor to grabbing.
    - `transform: scale(var(--grid-item-dragging-scale))`: Slightly enlarges the item.
    - `box-shadow: var(--grid-item-dragging-shadow)`: Adds a distinct shadow.

### `.vueblocks-resizing`

- **Description**: Applied to a grid item while it’s being resized.
- **Styles**:
    - `box-shadow: var(--grid-item-resizing-shadow)`: Adds a distinct shadow.

### `.resize-handle`

- **Description**: Base class for resize handles on grid items.
- **Styles**:
    - `width`, `height: var(--resize-handle-size)`: Sets the size.
    - `background: var(--resize-handle-bg-color)`: Sets the color.
    - `position: absolute`: Positions handles relative to the item.
    - `z-index: var(--resize-handle-z-index)`: Ensures handles are above the item.
    - `border-radius: var(--resize-handle-border-radius)`: Makes handles circular.
    - `opacity: var(--resize-handle-opacity)`: Default opacity.
    - `transition: var(--resize-handle-transition)`: Smooth transitions.

### `.resize-handle:hover`

- **Description**: Applied when hovering over a resize handle.
- **Styles**:
    - `opacity: var(--resize-handle-hover-opacity)`: Increases opacity.
    - `transform: scale(var(--resize-handle-hover-scale))`: Slightly enlarges the handle.

### `.top-left`, `.top-right`, `.bottom-left`, `.bottom-right`

- **Description**: Specific classes for positioning resize handles at each corner of the grid item.
- **Styles**:
    - Positioned using `top`, `right`, `bottom`, `left` with `--resize-handle-offset`.
    - `cursor`: Set to appropriate resize directions (`nwse-resize`, `nesw-resize`).

### `.vueblocks-grid-item.vueblocks-highlight`

- **Description**: Applied to highlight a grid item (e.g., when near another item).
- **Styles**:
    - `border: var(--grid-item-highlight-border-width) var(--grid-item-highlight-border-style) var(--grid-item-border-color)`: Adds a dashed border.

### `.vueblocks-grid-item.vueblocks-active`

- **Description**: Applied to the currently active grid item.
- **Styles**:
    - `border: var(--grid-item-active-border-width) var(--grid-item-active-border-style) var(--grid-item-border-color)`: Adds a solid border.
    - `box-shadow: var(--grid-item-active-shadow)`: Adds a distinct shadow.

---

## Customization Tips

- **Color Scheme**: Override `--grid-bg-color`, `--grid-item-bg-color`, and `--resize-handle-bg-color` to match your app’s theme.
- **Grid Visibility**: Adjust `--grid-line-color` and `--grid-cell-size` to make the grid more or less prominent.
- **Interaction Feedback**: Modify `--grid-item-dragging-scale`, `--resize-handle-hover-scale`, or shadow variables for stronger visual cues.
- **Performance**: Fine-tune `--grid-item-transition` and `--resize-handle-transition` durations for smoother or faster animations.

This guide covers the styling system for the grid, providing a flexible foundation for customization.
