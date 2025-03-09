<!-- docs/.vitepress/components/SimpleGrid.vue -->
<template>
    <div class="simple-grid-container">
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
</script>
