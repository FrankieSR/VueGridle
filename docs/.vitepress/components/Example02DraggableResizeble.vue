<template>
    <div class="simple-grid-container">
        <div class="controls">
            <label>
                <input type="checkbox" v-model="isDraggable" />
                Enable Dragging
            </label>
            <label>
                <input type="checkbox" v-model="isResizable" />
                Enable Resizing
            </label>
        </div>
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
                :draggable="isDraggable"
                :resizable="isResizable"
                v-model="item.grid"
                :minWidth="100"
                :minHeight="100"
            >
                <div class="grid-item-content">{{ item.label }}</div>
            </GridItem>
        </Grid>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const layout = ref([
    { id: 'item-1', label: 'Item 1', grid: { x: 50, y: 50, w: 100, h: 100 } },
    { id: 'item-2', label: 'Item 2', grid: { x: 200, y: 200, w: 100, h: 100 } },
]);

const isDraggable = ref(true);
const isResizable = ref(false);
</script>

<style scoped>
.simple-grid-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
}

.controls {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    color: var(--vp-c-text-1);
}
</style>

