---
outline: deep
---

# Keyboard Controls Example

This example demonstrates keyboard support for dashboard widgets.

<div class="demo-container">
    <Example06KeyboardControls />
</div>

## Usage

```vue
<Grid :gridCellSize="50" :layout="layout">
    <GridItem
        v-for="item in layout"
        :key="item.id"
        :nodeId="item.id"
        v-model="item.grid"
        :ariaLabel="`${item.label} widget`"
    >
        <WidgetCard :title="item.label" />
    </GridItem>
</Grid>
```

## Controls

- `Tab`: focus a widget
- `Enter` or `Space`: activate the focused widget
- Arrow keys: move the widget by one grid cell
- `Shift` + arrow keys: resize the widget by one grid cell

## Best Practice

Keep `focusable` enabled for interactive dashboards and provide `ariaLabel` for production widgets.
