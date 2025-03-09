<template>
    <div class="collision-container">
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
                @drag="checkCollision"
                @drag-stop="resolveCollisions"
                @resize="checkCollision"
                @resize-stop="resolveCollisions"
                :class="getCollisionClass(item.id)"
                :style="getCollisionStyle(item.id)"
            >
                <div class="grid-item-content">{{ item.label }}</div>
            </GridItem>
        </Grid>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const layout = ref([
    { id: 'item-1', label: 'Item 1', grid: { x: 50, y: 50, w: 150, h: 100 } },
    { id: 'item-2', label: 'Item 2', grid: { x: 250, y: 50, w: 150, h: 100 } },
    { id: 'item-3', label: 'Item 3', grid: { x: 50, y: 200, w: 150, h: 100 } },
]);

const collidingItems = ref<{ id: string; intensity: number }[]>([]);

const checkCollision = () => {
    const items = layout.value;

    collidingItems.value = [];

    for (let i = 0; i < items.length; i++) {
        const itemA = items[i];

        for (let j = i + 1; j < items.length; j++) {
            const itemB = items[j];

            if (isColliding(itemA.grid, itemB.grid)) {
                const intensity = calculateCollisionIntensity(itemA.grid, itemB.grid);
                collidingItems.value.push({ id: itemA.id, intensity }, { id: itemB.id, intensity });
            }
        }
    }
};

const resolveCollisions = () => {
    const items = layout.value;
    for (let i = 0; i < items.length; i++) {
        const itemA = items[i];
        for (let j = i + 1; j < items.length; j++) {
            const itemB = items[j];
            if (isColliding(itemA.grid, itemB.grid)) {
                resolveCollision(itemA.grid, itemB.grid);
            }
        }
    }
    setTimeout(() => (collidingItems.value = []), 300);
};

const isColliding = (a: any, b: any) => {
    return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
    );
};

const resolveCollision = (a: any, b: any) => {
    const dx = a.x + a.w / 2 - (b.x + b.w / 2);
    const dy = a.y + a.h / 2 - (b.y + b.h / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = (a.w + b.w) / 2;

    if (distance < minDistance) {
        const angle = Math.atan2(dy, dx);
        const pushDistance = minDistance - distance + 1;

        const pushX = Math.cos(angle) * pushDistance;
        const pushY = Math.sin(angle) * pushDistance;

        a.x -= pushX / 2;
        a.y -= pushY / 2;
        b.x += pushX / 2;
        b.y += pushY / 2;

        keepInBounds(a, 600, 600);
        keepInBounds(b, 600, 600);
    }
};

const keepInBounds = (grid: any, maxWidth: number, maxHeight: number) => {
    grid.x = Math.max(0, Math.min(grid.x, maxWidth - grid.w));
    grid.y = Math.max(0, Math.min(grid.y, maxHeight - grid.h));
};

const calculateCollisionIntensity = (a: any, b: any) => {
    const xOverlap = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
    const yOverlap = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
    const overlapArea = xOverlap * yOverlap;
    const itemArea = a.w * a.h;
    return Math.min(overlapArea / itemArea, 1);
};

const getCollisionClass = (id: string) => ({
    colliding: collidingItems.value.some(item => item.id === id),
});

const getCollisionStyle = computed(() => (id: string) => {
    const collision = collidingItems.value.find(item => item.id === id);
    if (!collision) return {};
    const intensity = collision.intensity;
    const scale = 1 + intensity * 0.1;
    const hue = 360 - intensity * 360;
    return {
        transform: `scale(${scale})`,
        backgroundColor: `hsl(${hue}, 70%, 50%)`,
        transition: 'transform 0.2s ease-out',
    };
});
</script>

<style scoped>
.collision-container {
    padding: 16px;
}

.colliding .grid-item-content {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
</style>

