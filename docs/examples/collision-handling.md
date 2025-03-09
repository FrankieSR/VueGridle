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
                    v-model="item.grid"
                    :minWidth="100"
                    :minHeight="100"
                    @drag-stop="handleCollision"
                    @resize-stop="handleCollision"
                    @collision-detected="onCollisionDetected(item.id, $event)"
                    :class="{ colliding: collidingItems.includes(item.id) }"
                >
                    <div class="grid-item-content">{{ item.label }}</div>
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
import Grid from './Grid.vue';
import GridItem from './GridItem.vue';

const layout = ref([
    { id: 'item-1', label: 'Item 1', grid: { x: 50, y: 50, w: 150, h: 100 } },
    { id: 'item-2', label: 'Item 2', grid: { x: 250, y: 50, w: 150, h: 100 } },
    { id: 'item-3', label: 'Item 3', grid: { x: 50, y: 200, w: 150, h: 100 } },
]);

const collidingItems = ref<string[]>([]);
const collisionLogs = ref<string[]>([]);

const onCollisionDetected = (id: string, collidingIds: string[]) => {
    if (collidingIds.length > 0) {
        collidingItems.value = [id, ...collidingIds];
        collisionLogs.value.unshift(`[${new Date().toLocaleTimeString()}] ${id} collided with ${collidingIds.join(', ')}`);
    } else {
        collidingItems.value = collidingItems.value.filter(itemId => itemId !== id);
    }
};

const handleCollision = () => {
    const items = layout.value;
    for (let i = 0; i < items.length; i++) {
        const itemA = items[i];
        for (let j = i + 1; j < items.length; j++) {
            const itemB = items[j];
            if (isColliding(itemA, itemB)) {
                resolveCollision(itemA, itemB);
            }
        }
    }
    collidingItems.value = []; // Сбрасываем подсветку после разрешения
};

const isColliding = (itemA: any, itemB: any) => {
    const a = itemA.grid;
    const b = itemB.grid;
    return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
    );
};

const resolveCollision = (itemA: any, itemB: any) => {
    const a = itemA.grid;
    const b = itemB.grid;

    const dx = (a.x + a.w / 2) - (b.x + b.w / 2);
    const dy = (a.y + a.h / 2) - (b.y + b.h / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = (a.w + b.w) / 2;

    if (distance < minDistance) {
        const angle = Math.atan2(dy, dx);
        const pushDistance = minDistance - distance;

        const pushX = Math.cos(angle) * pushDistance;
        const pushY = Math.sin(angle) * pushDistance;

        // Отталкиваем оба элемента
        a.x -= pushX / 2;
        a.y -= pushY / 2;
        b.x += pushX / 2;
        b.y += pushY / 2;

        // Ограничиваем перемещение внутри грида
        keepInBounds(a, 400, 400);
        keepInBounds(b, 400, 400);
    }
};

const keepInBounds = (grid: any, maxWidth: number, maxHeight: number) => {
    grid.x = Math.max(0, Math.min(grid.x, maxWidth - grid.w));
    grid.y = Math.max(0, Math.min(grid.y, maxHeight - grid.h));
};
</script>

<style scoped>
.collision-container {
    display: flex;
    align-items: flex-start;
    padding: 16px;
    gap: 20px;
}

.grid-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.grid-demo {
    width: 400px;
    height: 400px;
    border: 1px solid var(--grid-item-border-color);
    position: relative;
}

.grid-item-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(96, 165, 250, 0.1);
    color: #fff;
    font-weight: bold;
    border-radius: 6px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.colliding .grid-item-content {
    background: rgba(255, 107, 107, 0.3);
    border: 2px solid #ff6b6b;
}

.collision-log {
    width: 300px;
    max-height: 400px;
    background: #1e1e1e;
    border-radius: 8px;
    padding: 10px;
    color: #d4d4d4;
    overflow-y: auto;
}

.collision-log h3 {
    margin: 0 0 10px 0;
    font-size: 16px;
    color: #fff;
}

.collision-log ul {
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 12px;
}

.collision-log li {
    padding: 5px 0;
    border-bottom: 1px solid #333;
}
</style>

