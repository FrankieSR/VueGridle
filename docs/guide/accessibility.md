---
outline: deep
---

# Accessibility

VueGridle includes keyboard controls by default so dashboard widgets are not pointer-only.

## Keyboard Controls

| Action           | Keys                 |
| ---------------- | -------------------- |
| Focus an item    | `Tab`                |
| Activate an item | `Enter` or `Space`   |
| Move an item     | Arrow keys           |
| Resize an item   | `Shift` + arrow keys |

Movement and resizing use the parent `Grid` `gridCellSize`.

## Accessible Names

Use `ariaLabel` when `nodeId` is technical or not meaningful to screen reader users.

```vue
<GridItem nodeId="kpi-revenue-q4" ariaLabel="Revenue KPI widget" v-model="item.grid" />
```

If `ariaLabel` is omitted, VueGridle uses `Grid item {nodeId}`.

## Focus Behavior

`GridItem` is focusable by default:

```vue
<GridItem :focusable="true" />
```

Disable focus only for decorative or non-interactive items:

```vue
<GridItem :focusable="false" :draggable="false" :resizable="false" />
```

## Real App Checklist

- Provide meaningful `ariaLabel` values for dashboard widgets.
- Keep visible focus styles enabled.
- Do not trap focus inside widget content.
- If a widget contains buttons or inputs, make sure those controls have their own labels.
- Save keyboard-driven layout changes the same way as pointer-driven changes.

## Current Scope

VueGridle provides focusability, keyboard movement, keyboard resize, and accessible labels. Live announcements for position and size changes are not included yet.
