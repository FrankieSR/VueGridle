<template>
    <div class="drag-outside-container">
        <div class="drag-outside-inner-box">
            <div class="source-zone">
                <div
                    class="source-item"
                    draggable="true"
                    @dragstart="startDragging"
                    @dragend="endDragging"
                >
                    Drag Me
                </div>
            </div>

            <div class="grid-wrapper">
                <Grid
                    :gridCellSize="50"
                    class="grid-demo"
                    @dragover.prevent
                    @drop="handleDropInGrid"
                >
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
                    >
                        <div class="grid-item-content">{{ item.label }}</div>
                    </GridItem>
                </Grid>
            </div>
        </div>
        {{ layout }}
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';

    const layout = ref([{ id: 'item-1', label: 'Item 1', grid: { x: 50, y: 50, w: 100, h: 100 } }]);

    let isDragging = false;

    const startDragging = (event: DragEvent) => {
        isDragging = true;
        event.dataTransfer?.setData('text/plain', 'new-item'); // Передаём идентификатор
    };

    const endDragging = () => {
        isDragging = false;
    };

    const handleDropInGrid = (event: DragEvent) => {
        event.preventDefault();
        if (isDragging) {
            const newId = `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            layout.value.push({
                id: newId,
                label: `Item ${layout.value.length + 1}`,
                grid: { x: event.offsetX - 50, y: event.offsetY - 50, w: 100, h: 100 },
            });
            isDragging = false;
        }
    };
</script>

<style scoped>
    .drag-outside-container {
        padding: 16px;
        gap: 16px;
    }

    .drag-outside-inner-box {
        display: flex;
        gap: 24px;
        margin-bottom: 24px;
    }

    .grid-wrapper {
        align-items: center;
    }

    .source-zone {
        flex: 1;
        height: 100px;
        background: #2d2d2d;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #d4d4d4;
    }

    .source-item {
        padding: 16px 16px;
        background: #6ee7b7;
        color: #1e2229;
        border-radius: 6px;
        cursor: grab;
        user-select: none;
    }

    .source-item:active {
        cursor: grabbing;
    }
</style>
