<template>
    <div class="main-content">
        <Grid :gridCellSize="50" :layout="layout" class="grid-demo">
            <GridItem
                v-for="item in layout"
                :key="item.id"
                :nodeId="item.id"
                v-model="item.grid"
                :minWidth="100"
                :minHeight="100"
                :ariaLabel="`${item.label} widget`"
                @item-activated="activeId = item.id"
                @drag-stop="activeId = item.id"
                @resize-stop="activeId = item.id"
            >
                <div class="grid-item-content">
                    {{ item.label }}
                </div>
            </GridItem>
        </Grid>

        <div class="console-panel">
            <div class="console-header">Keyboard controls</div>
            <div class="console-body">
                <div class="console-line">Tab: focus item</div>
                <div class="console-line">Enter / Space: activate</div>
                <div class="console-line">Arrow keys: move</div>
                <div class="console-line">Shift + arrows: resize</div>
                <div class="console-line console-warning">
                    Active: {{ activeId ?? 'none' }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeId = ref<string | null>(null);
const layout = ref([
    { id: 'summary', label: 'Summary', grid: { x: 50, y: 50, w: 150, h: 100 } },
    { id: 'chart', label: 'Chart', grid: { x: 250, y: 150, w: 200, h: 150 } },
]);
</script>
