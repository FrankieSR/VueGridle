<template>
    <div class="app-container">
        <Grid :gridCellSize="50" class="grid-demo">
            <GridItem
                v-for="item in layout"
                :key="item.id"
                :nodeId="item.id"
                :x="item.grid.x"
                :y="item.grid.y"
                :w="item.grid.w"
                :h="item.grid.h"
                :proximity="100"
                :allNodes="layout"
                :draggable="true"
                :resizable="true"
                :free-drag="item.freeDrag"
                v-model="item.grid"
                :minWidth="100"
                :minHeight="100"
                @drag-start="onDragStart(item.id)"
                @drag="(x, y) => onDrag(item.id, x, y)"
                @drag-stop="(x, y) => onDragStop(item.id, x, y)"
                @resize-start="onResizeStart(item.id)"
                @resize="(x, y, w, h) => onResize(item.id, x, y, w, h)"
                @resize-stop="(x, y, w, h) => onResizeStop(item.id, x, y, w, h)"
                @update:model-value="(value) => onUpdateModelValue(item.id, value)"
                @item-activated="onItemActivated(item.id)"
                @item-deactivated="onItemDeactivated(item.id)"
                @drop="(nodeId, x, y) => onDrop(item.id, x, y)"
                @collision-detected="(collidingIds) => onCollisionDetected(item.id, collidingIds)"
            >
                <div class="grid-item-content">{{ item.label }}
                    <button @click="clicked">Click me</button>
                </div>
            </GridItem>
        </Grid>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import Grid from './components/Grid.vue';
    import GridItem from './components/GridItem.vue';

    const layout = ref([
        { id: 'item-1', label: 'Item 1' ,grid: { x: 50, y: 50, w: 200, h: 100 } },
        { id: 'item-2', label: 'Item 2', grid: { x: 300, y: 200, w: 200, h: 100 } },
        { id: 'free-drag', label: 'Free Drag', freeDrag: true, grid: { x: 300, y: 200, w: 200, h: 100, z: 2 } },
    ]);

    const onDragStart = (nodeId: string) => {
        console.log(`[${nodeId}] Drag started`);
    };

    const onDrag = (nodeId: string, x: number, y: number) => {
        console.log(`[${nodeId}] Dragging to x: ${x}, y: ${y}`);
    };

    const clicked = () => {
        console.log("CLICKED");
    }

    const onDragStop = (nodeId: string, x: number, y: number) => {
        console.log(`[${nodeId}] Drag stopped at x: ${x}, y: ${y}`);
    };

    const onResizeStart = (nodeId: string) => {
        console.log(`[${nodeId}] Resize started`);
    };

    const onResize = (nodeId: string, x: number, y: number, w: number, h: number) => {
        console.log(`[${nodeId}] Resizing to x: ${x}, y: ${y}, w: ${w}, h: ${h}`);
    };

    const onResizeStop = (nodeId: string, x: number, y: number, w: number, h: number) => {
        console.log(`[${nodeId}] Resize stopped at x: ${x}, y: ${y}, w: ${w}, h: ${h}`);
    };

    const onUpdateModelValue = (
        nodeId: string,
        value: { x: number; y: number; w: number; h: number },
    ) => {
        console.log(
            `[${nodeId}] Model updated to x: ${value.x}, y: ${value.y}, w: ${value.w}, h: ${value.h}`,
        );
    };

    const onItemActivated = (nodeId: string) => {
        console.log(`[${nodeId}] Item activated`);
    };

    const onItemDeactivated = (nodeId: string) => {
        console.log(`[${nodeId}] Item deactivated`);
    };

    const onDrop = (nodeId: string, x: number, y: number) => {
        console.log(`[${nodeId}] Dropped at x: ${x}, y: ${y}`);
    };

    const onCollisionDetected = (nodeId: string, collidingIds: string[]) => {
        console.log(`[${nodeId}] Collision detected with: ${collidingIds}`);
    };
</script>

<style scoped>
    .app-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        min-height: 100vh;
        background: var(--grid-bg-color);
        background-size: 40px 40px;
    }

    .grid-demo {
        width: 500px;
        height: 500px;
        border: 1px solid var(--grid-item-border-color);
        position: relative;
    }

    .grid-item-content {
        width: 100%;
        height: 100%;
        font-family: 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;      
        font-size: 24px;
  background: -webkit-linear-gradient(#eee, #333);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
    }
</style>
