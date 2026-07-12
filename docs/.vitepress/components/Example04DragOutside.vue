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
                    :layout="layout"
                    class="grid-demo drag-outside-grid"
                    @dragover.prevent
                    @drop="handleDropInGrid"
                >
                    <GridItem
                        v-for="item in layout"
                        :key="item.id"
                        :nodeId="item.id"
                        v-model="item.grid"
                        :minWidth="100"
                        :minHeight="100"
                        :ariaLabel="`${item.label} widget`"
                    >
                        <div class="grid-item-content">{{ item.label }}</div>
                    </GridItem>
                </Grid>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';

    const layout = ref([{ id: 'item-1', label: 'Item 1', grid: { x: 50, y: 50, w: 100, h: 100 } }]);

    let isDragging = false;

    const startDragging = (event: DragEvent) => {
        isDragging = true;
        event.dataTransfer?.setData('text/plain', 'new-item');
    };

    const endDragging = () => {
        isDragging = false;
    };

    const handleDropInGrid = (event: DragEvent) => {
        event.preventDefault();
        if (isDragging) {
            const gridElement = event.currentTarget as HTMLElement;
            const gridRect = gridElement.getBoundingClientRect();
            const x = Math.max(0, Math.round((event.clientX - gridRect.left - 50) / 50) * 50);
            const y = Math.max(0, Math.round((event.clientY - gridRect.top - 50) / 50) * 50);
            const newId = `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            layout.value.push({
                id: newId,
                label: `Item ${layout.value.length + 1}`,
                grid: { x, y, w: 100, h: 100 },
            });
            isDragging = false;
        }
    };
</script>

<style scoped>
    .drag-outside-container {
        padding: 0;
    }

    .drag-outside-inner-box {
        display: grid;
        grid-template-columns: 180px minmax(0, 1fr);
        gap: 24px;
        margin-bottom: 24px;
        align-items: start;
    }

    .grid-wrapper {
        min-width: 0;
    }

    .source-zone {
        flex: 0 0 180px;
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

    .drag-outside-grid {
        width: 100%;
        max-width: 560px;
        height: 360px;
    }

    @media only screen and (max-width: 760px) {
        .drag-outside-inner-box {
            grid-template-columns: 1fr;
        }
    }
</style>
