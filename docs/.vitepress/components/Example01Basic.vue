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
                :allNodes="layout"
                :draggable="true"
                :resizable="true"
                :free-drag="item.freeDrag"
                v-model="item.grid"
                :minWidth="100"
                :minHeight="100"
                :proximity="150"
            >
                <div class="grid-item-content">{{ item.label }}</div>
            </GridItem>
        </Grid>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';

    const layout = ref([
        { id: 'item-1', label: 'Node 1', grid: { x: 0, y: 0, w: 100, h: 100 } },
        { id: 'item-2', label: 'Node 2', grid: { x: 100, y: 50, w: 100, h: 100 } },
        { id: 'item-3', label: 'Node 3', grid: { x: 200, y: 100, w: 100, h: 100 } },
        { id: 'item-4', label: 'Node 4', grid: { x: 300, y: 150, w: 100, h: 100 } },
        { id: 'free-drag', label: 'Free Drag', freeDrag: true, grid: { x: 400, y: 200, w: 100, h: 100, z: 2 } },
    ]);
</script>

