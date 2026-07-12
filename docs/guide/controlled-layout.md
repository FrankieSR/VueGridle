---
outline: deep
---

# Controlled Layout

VueGridle is designed around a controlled layout model. Your application owns the layout data, and each `GridItem` writes changes back through `v-model`.

## Recommended Shape

```ts
import { ref } from 'vue';
import type { GridNode } from 'vuegridle';

const layout = ref<GridNode[]>([
    { id: 'revenue', grid: { x: 0, y: 0, w: 300, h: 160 } },
    { id: 'orders', grid: { x: 320, y: 0, w: 220, h: 160 } },
]);
```

Use a stable `id` for each item. Do not use array indexes as IDs because drag, resize, collision detection, and persistence all depend on stable identity.

## Wiring the Grid

```vue
<Grid :gridCellSize="20" :layout="layout" class="dashboard-grid">
    <GridItem
        v-for="item in layout"
        :key="item.id"
        :nodeId="item.id"
        v-model="item.grid"
        :draggable="true"
        :resizable="true"
        :ariaLabel="`${item.id} widget`"
    >
        <WidgetCard :id="item.id" />
    </GridItem>
</Grid>
```

`Grid :layout` is the preferred way to share layout context with items. It powers collision detection and proximity checks without repeating the same array on every `GridItem`.

## Persisting Layouts

Persist layout changes from `v-model`, `drag-stop`, or `resize-stop`.

```ts
const saveLayout = async () => {
    await api.saveDashboardLayout(
        layout.value.map((item) => ({
            id: item.id,
            grid: item.grid,
        })),
    );
};
```

For real dashboards, debounce network writes and save on final events rather than every `drag` or `resize`.

```vue
<GridItem v-model="item.grid" :nodeId="item.id" @drag-stop="saveLayout" @resize-stop="saveLayout" />
```

## Resetting Layouts

Because `modelValue` is the source of truth, external resets should replace the layout values.

```ts
const resetLayout = () => {
    layout.value = defaultLayout.map((item) => ({
        ...item,
        grid: { ...item.grid },
    }));
};
```

## Deprecated `allNodes`

`GridItem :allNodes` is deprecated. It remains available for legacy code and advanced overrides, but new code should pass `layout` once to `Grid`.

```vue
<!-- Recommended -->
<Grid :layout="layout">
    <GridItem v-for="item in layout" :key="item.id" :nodeId="item.id" v-model="item.grid" />
</Grid>
```

```vue
<!-- Deprecated -->
<GridItem :allNodes="layout" />
```

## Best Practices

- Keep layout state in one place.
- Use stable IDs.
- Save on `drag-stop` and `resize-stop`, not every frame.
- Keep `Grid :layout` in sync with the same array used by `v-for`.
- Clone defaults when resetting layouts.
