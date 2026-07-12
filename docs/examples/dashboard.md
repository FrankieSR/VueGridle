---
outline: deep
---

# Dashboard Layout Example

This example shows a realistic dashboard setup: typed layout state, stable widget IDs, persistence hooks, and accessible labels.

## Example Code

```vue
<template>
    <div class="dashboard-shell">
        <header class="dashboard-toolbar">
            <h1>Operations Dashboard</h1>
            <button type="button" @click="resetLayout">Reset layout</button>
        </header>

        <Grid :gridCellSize="20" :layout="layout" class="dashboard-grid">
            <GridItem
                v-for="item in layout"
                :key="item.id"
                :nodeId="item.id"
                v-model="item.grid"
                :draggable="true"
                :resizable="true"
                :minWidth="180"
                :minHeight="120"
                :ariaLabel="`${item.title} widget`"
                @drag-stop="saveLayout"
                @resize-stop="saveLayout"
                @collision-detected="(ids) => markCollision(item.id, ids)"
            >
                <section class="dashboard-card" :class="{ warning: collisionId === item.id }">
                    <h2>{{ item.title }}</h2>
                    <p>{{ item.value }}</p>
                    <small>{{ item.caption }}</small>
                </section>
            </GridItem>
        </Grid>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { Grid, GridItem, type GridNode } from 'vuegridle';
    import 'vuegridle/style.css';

    type DashboardItem = GridNode & {
        title: string;
        value: string;
        caption: string;
    };

    const defaultLayout: DashboardItem[] = [
        {
            id: 'revenue',
            title: 'Revenue',
            value: '$128.4K',
            caption: 'Month to date',
            grid: { x: 0, y: 0, w: 300, h: 160 },
        },
        {
            id: 'orders',
            title: 'Orders',
            value: '1,284',
            caption: 'Last 30 days',
            grid: { x: 320, y: 0, w: 240, h: 160 },
        },
        {
            id: 'pipeline',
            title: 'Pipeline',
            value: '$942K',
            caption: 'Weighted forecast',
            grid: { x: 0, y: 180, w: 560, h: 220 },
        },
    ];

    const cloneLayout = () =>
        defaultLayout.map((item) => ({
            ...item,
            grid: { ...item.grid },
        }));

    const layout = ref<DashboardItem[]>(cloneLayout());
    const collisionId = ref<string | null>(null);

    const saveLayout = async () => {
        const payload = layout.value.map(({ id, grid }) => ({ id, grid }));
        localStorage.setItem('dashboard-layout', JSON.stringify(payload));
    };

    const resetLayout = () => {
        layout.value = cloneLayout();
        void saveLayout();
    };

    const markCollision = (id: string, collidingIds: string[]) => {
        if (collidingIds.length === 0) return;
        collisionId.value = id;
        window.setTimeout(() => {
            collisionId.value = null;
        }, 800);
    };
</script>

<style scoped>
    .dashboard-shell {
        display: grid;
        gap: 16px;
    }

    .dashboard-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .dashboard-grid {
        width: 100%;
        height: 640px;
        border: 1px solid var(--grid-item-border-color);
    }

    .dashboard-card {
        height: 100%;
        padding: 16px;
        background: var(--grid-item-bg-color);
    }

    .dashboard-card.warning {
        outline: 2px solid #f97316;
    }
</style>
```

## Notes

- Save on `drag-stop` and `resize-stop`.
- Keep default layout immutable and clone it when resetting.
- Use stable IDs such as `revenue`, `orders`, and `pipeline`.
- Add `ariaLabel` for each real dashboard widget.
