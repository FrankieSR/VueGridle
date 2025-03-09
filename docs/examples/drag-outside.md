---
outline: deep
---

# 04. Drag Outside Example

---

<div class="demo-container">
    <Example04DragOutside />
</div>

## Example Code

```vue
<template>
    <div class="drag-outside-container">
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
                    v-model="item.grid"
                    :minWidth="100"
                    :minHeight="100"
                    @drag="(x, y) => onDrag(item.id, x, y)"
                    @drop="(nodeId, x, y) => onDrop(nodeId, x, y)"
                >
                    <div class="grid-item-content">{{ item.label }}</div>
                </GridItem>
            </Grid>
        </div>

        <div
            class="drop-zone"
            :class="{ 'drop-zone-active': isDraggingOver }"
            @dragover.prevent="isDraggingOver = true"
            @dragleave="isDraggingOver = false"
            @drop="handleDropOutside"
        >
            <p>Drop here to remove</p>
            <ul v-if="removedItems.length">
                <li v-for="item in removedItems" :key="item.id">{{ item.label }}</li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Grid from './Grid.vue';
import GridItem from './GridItem.vue';

const layout = ref([
    { id: 'item-1', label: 'Item 1', grid: { x: 50, y: 50, w: 100, h: 100 } },
    { id: 'item-2', label: 'Item 2', grid: { x: 200, y: 50, w: 100, h: 100 } },
    { id: 'item-3', label: 'Item 3', grid: { x: 50, y: 200, w: 100, h: 100 } },
]);

const removedItems = ref([]);
const isDraggingOver = ref(false);
let draggedItemId = null;

const onDrag = (id: string, x: number, y: number) => {
    draggedItemId = id;
};

const onDrop = (nodeId: string, x: number, y: number) => {
    draggedItemId = null; // Сбрасываем draggedItemId, если элемент отпущен внутри грида
};

const handleDropOutside = (event: DragEvent) => {
    event.preventDefault();
    isDraggingOver.value = false;

    if (draggedItemId) {
        const index = layout.value.findIndex((item) => item.id === draggedItemId);
        if (index !== -1) {
            const [removedItem] = layout.value.splice(index, 1);
            removedItems.value.push(removedItem);
            draggedItemId = null;
        }
    }
};
</script>

<style scoped>
.drag-outside-container {
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

.drop-zone {
    width: 200px;
    height: 400px;
    background: #2d2d2d;
    border: 2px dashed #666;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #d4d4d4;
    transition: all 0.2s ease;
}

.drop-zone-active {
    background: #3e63dd;
    border-color: #89b4fa;
    color: #fff;
}

.drop-zone p {
    margin: 0;
    font-size: 16px;
}

.drop-zone ul {
    list-style: none;
    padding: 0;
    margin-top: 10px;
    text-align: center;
}

.drop-zone li {
    padding: 5px 0;
    font-size: 14px;
}
</style>
```

## Source

- [View on GitHub](https://github.com/username/repo/blob/main/docs/.vitepress/components/Example04DragOutside.vue)

