<template>
    <div class="app-container">
        <h1 class="title">Vue Grid Layout Demo</h1>
        <Grid :gridCellSize="50" class="grid-demo">
            <GridItem
                v-for="item in items"
                :key="item.id"
                :nodeId="item.id"
                :x="item.grid.x"
                :y="item.grid.y"
                :w="item.grid.w"
                :h="item.grid.h"
                :allNodes="items"
                :draggable="true"
                :resizable="true"
                @dragStop="
                    (x, y) => {
                        item.grid.x = x;
                        item.grid.y = y;
                    }
                "
                @resizeStop="
                    (x, y, w, h) => {
                        item.grid.x = x;
                        item.grid.y = y;
                        item.grid.w = w;
                        item.grid.h = h;
                    }
                "
                @collisionDetected="
                    ({ nodeId, collidingIds }) =>
                        console.log(`${nodeId} collided with ${collidingIds}`)
                "
                @boundaryReached="({ nodeId, edge }) => console.log(`${nodeId} reached ${edge}`)"
                @drop="({ nodeId, x, y }) => console.log(`${nodeId} dropped at ${x}, ${y}`)"
                @snap="({ nodeId, x, y }) => console.log(`${nodeId} snapped to ${x}, ${y}`)"
                @itemActivated="({ nodeId }) => console.log(`${nodeId} activated`)"
                @itemDeactivated="({ nodeId }) => console.log(`${nodeId} deactivated`)"
                @proximityChange="
                    ({ nodeId, isNear }) =>
                        console.log(`${nodeId} is${isNear ? '' : ' not'} near active`)
                "
                @gridOverflow="
                    ({ nodeId, direction }) => console.log(`${nodeId} overflowed ${direction}`)
                "
                @layoutChange="({ nodes }) => console.log('Layout changed:', nodes)"
            >
                <div class="grid-item-content">{{ item.id }}</div>
            </GridItem>
        </Grid>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import Grid from './components/Grid.vue';
    import GridItem from './components/GridItem.vue';

    const items = ref([
        {
            id: 'item-1',
            grid: {
                x: 50,
                y: 50,
                w: 200,
                h: 100,
            },
        },
        {
            id: 'item-2',
            grid: {
                x: 300,
                y: 200,
                w: 200,
                h: 100,
            },
        },
        {
            id: 'item-3',
            grid: {
                x: 300,
                y: 200,
                w: 200,
                h: 100,
            },
        },
    ]);
</script>

<style scoped>
    .app-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
    }

    .title {
        font-size: 24px;
        margin-bottom: 20px;
        color: #333;
    }

    .grid-demo {
        width: 800px;
        height: 600px;
        border: 2px solid #ddd;
        position: relative;
        overflow: hidden;
    }

    .grid-item-content {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #4a90e2;
        color: white;
        font-weight: bold;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
</style>
