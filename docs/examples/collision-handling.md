---
outline: deep
---

# Collision Handling Example

Use `collision-detected` to warn users, reject a save, or show custom overlap feedback.

<div class="demo-container">
    <Example05CollisionHandling />
</div>

## Example Code

```vue
<template>
    <div class="main-content">
        <Grid :gridCellSize="50" :layout="layout" class="grid-demo">
            <GridItem
                v-for="item in layout"
                :key="item.id"
                :nodeId="item.id"
                v-model="item.grid"
                :minWidth="100"
                :minHeight="100"
                :proximity="150"
                :ariaLabel="`${item.label} widget`"
                :class="{ colliding: collidingItemId === item.id }"
                @collision-detected="onCollisionDetected(item.id, $event)"
            >
                <template #default="{ isNearActive }">
                    <div class="grid-item-content" :class="{ near: isNearActive }">
                        {{ item.label }}
                    </div>
                </template>
            </GridItem>
        </Grid>

        <div class="console-panel">
            <div class="console-body">
                <div v-for="(log, index) in collisionLogs" :key="index" class="console-line">
                    {{ log }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { Grid, GridItem } from 'vuegridle';
    import 'vuegridle/style.css';

    const layout = ref([
        { id: 'item-1', label: 'Revenue', grid: { x: 50, y: 50, w: 150, h: 100 } },
        { id: 'item-2', label: 'Orders', grid: { x: 250, y: 50, w: 150, h: 100 } },
        { id: 'item-3', label: 'Pipeline', grid: { x: 50, y: 220, w: 150, h: 100 } },
    ]);

    const collidingItemId = ref<string | null>(null);
    const collisionLogs = ref<string[]>([]);

    const onCollisionDetected = (id: string, collidingIds: string[]) => {
        if (collidingIds.length === 0) return;

        collidingItemId.value = id;
        collisionLogs.value.unshift(`${id} overlaps ${collidingIds.join(', ')}`);
        collisionLogs.value = collisionLogs.value.slice(0, 6);

        window.setTimeout(() => {
            collidingItemId.value = null;
        }, 800);
    };
</script>
```

## Best Practice

Use collision events for feedback and validation. Keep the source layout controlled by your app so rejected saves can be rolled back cleanly.

## Source

- [View on GitHub](https://github.com/FrankieSR/VueGridle/blob/main/docs/.vitepress/components/Example05CollisionHandling.vue)
