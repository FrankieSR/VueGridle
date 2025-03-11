---
outline: deep
---

# 05. Collision Handling Example

---

<div class="demo-container">
    <Example05CollisionHandling />
</div>

## Example Code

```vue
<template>
    <div class="collision-container">
        <div class="grid-wrapper">
            <Grid :gridCellSize="50" class="grid-demo">
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
                    :resizable="true"
                    :proximity="150"
                    v-model="item.grid"
                    :minWidth="100"
                    :minHeight="100"
                    @drag-stop="handleCollision"
                    @resize-stop="handleCollision"
                    @collision-detected="onCollisionDetected(item.id, $event)"
                    :class="{
                        colliding: isColisionId === item.id,
                    }"
                >
                    <template #default="{ isNearActive }">
                        <div class="grid-item-content">

                            {{ !!isNearActive }}
                        </div>
                    </template>
                </GridItem>
            </Grid>
        </div>
        <div class="collision-log">
            <h3>Collision Log</h3>
            <ul>
                <li v-for="(log, index) in collisionLogs" :key="index">{{ log }}</li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';

    const layout = ref([
        { id: 'item-1', label: 'Item 1', grid: { x: 50, y: 50, w: 150, h: 100 } },
        { id: 'item-2', label: 'Item 2', grid: { x: 250, y: 50, w: 150, h: 100 } },
        { id: 'item-3', label: 'Item 3', grid: { x: 50, y: 200, w: 150, h: 100 } },
    ]);

    const isColisionId = ref<string | null>(null);
    const collisionLogs = ref<string[]>([]);

    const onCollisionDetected = (id: string, collidingIds: string[]) => {
        isColisionId.value = id;

        setTimeout(() => {
            isColisionId.value = null;
        }, 1500);
    }
</script>

<style scoped>
    .colliding .grid-item-content {
        background: linear-gradient(135deg, rgba(255, 215, 0, 0.7), rgba(255, 107, 107, 0.7));
        border: 2px solid #ffd700;
        animation: pulse 0.5s infinite alternate;
        transform: scale(1.05);
    }

    .near-active .grid-item-content {
        background: linear-gradient(135deg, rgba(50, 205, 50, 0.7), rgba(135, 206, 235, 0.7));
        border: 2px solid #32cd32;
        animation: glow 0.7s infinite alternate;
        transform: scale(1.02);
    }

    @keyframes pulse {
        from {
            box-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
        }
        to {
            box-shadow: 0 0 15px rgba(255, 215, 0, 0.9);
        }
    }
</style>
