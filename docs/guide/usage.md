---
outline: deep
---

# Usage Patterns

This guide shows how to use VueGridle in application code instead of only in demos.

## Minimal Controlled Grid

```vue
<template>
    <Grid :gridCellSize="20" :layout="layout" class="dashboard-grid">
        <GridItem
            v-for="item in layout"
            :key="item.id"
            :nodeId="item.id"
            v-model="item.grid"
            :draggable="true"
            :resizable="true"
            :ariaLabel="item.label"
        >
            <section class="widget">
                <h2>{{ item.label }}</h2>
                <component :is="item.component" />
            </section>
        </GridItem>
    </Grid>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { Grid, GridItem, type GridNode } from 'vuegridle';
    import 'vuegridle/style.css';

    type DashboardItem = GridNode & {
        label: string;
        component: string;
    };

    const layout = ref<DashboardItem[]>([
        {
            id: 'revenue',
            label: 'Revenue',
            component: 'RevenueWidget',
            grid: { x: 0, y: 0, w: 320, h: 180 },
        },
        {
            id: 'orders',
            label: 'Orders',
            component: 'OrdersWidget',
            grid: { x: 340, y: 0, w: 240, h: 180 },
        },
    ]);
</script>

<style scoped>
    .dashboard-grid {
        width: 100%;
        height: 720px;
    }

    .widget {
        height: 100%;
        padding: 16px;
        background: var(--grid-item-bg-color);
    }
</style>
```

## Save Only Final Changes

Use `drag-stop` and `resize-stop` for persistence. Use `drag` and `resize` only for live UI feedback.

```vue
<GridItem v-model="item.grid" :nodeId="item.id" @drag-stop="saveLayout" @resize-stop="saveLayout" />
```

```ts
const saveLayout = async () => {
    await dashboardApi.updateLayout(layout.value.map(({ id, grid }) => ({ id, grid })));
};
```

## Handle Collisions

Collision detection uses the parent `Grid :layout` by default.

```vue
<Grid :layout="layout">
    <GridItem
        v-for="item in layout"
        :key="item.id"
        :nodeId="item.id"
        v-model="item.grid"
        @collision-detected="(ids) => showCollisionWarning(item.id, ids)"
    />
</Grid>
```

```ts
const showCollisionWarning = (nodeId: string, collidingIds: string[]) => {
    notifications.value.push(`${nodeId} overlaps ${collidingIds.join(', ')}`);
};
```

## Reset a User Layout

Keep defaults separate from user state.

```ts
const defaultLayout: DashboardItem[] = [
    {
        id: 'revenue',
        label: 'Revenue',
        component: 'RevenueWidget',
        grid: { x: 0, y: 0, w: 320, h: 180 },
    },
];

const resetLayout = () => {
    layout.value = defaultLayout.map((item) => ({
        ...item,
        grid: { ...item.grid },
    }));
};
```

## Recommended App Structure

```txt
src/
  dashboards/
    layout.ts
    DashboardGrid.vue
    widgets/
      RevenueWidget.vue
      OrdersWidget.vue
```

Keep layout data close to the dashboard feature, not inside the reusable widget components.

## Production Checklist

- Store layout state in your app.
- Use stable IDs from your backend or dashboard configuration.
- Import `vuegridle/style.css` once.
- Pass `layout` to `Grid`; do not pass `allNodes` to every item.
- Provide `ariaLabel` for real widgets.
- Persist on final events, not every frame.
