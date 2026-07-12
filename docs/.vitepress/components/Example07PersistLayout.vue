<template>
    <div class="example-shell">
        <div class="example-toolbar">
            <button class="example-button" type="button" @click="saveLayout">Save layout</button>
            <button class="example-button" type="button" @click="resetLayout">Reset</button>
            <span>{{ status }}</span>
        </div>

        <Grid :gridCellSize="50" :layout="layout" class="grid-demo">
            <GridItem
                v-for="item in layout"
                :key="item.id"
                :nodeId="item.id"
                v-model="item.grid"
                :minWidth="100"
                :minHeight="100"
                :ariaLabel="`${item.label} widget`"
                @drag-stop="saveLayout"
                @resize-stop="saveLayout"
            >
                <div class="grid-item-content">{{ item.label }}</div>
            </GridItem>
        </Grid>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const storageKey = 'vuegridle-docs-layout';
const defaultLayout = [
    { id: 'kpi', label: 'KPI', grid: { x: 50, y: 50, w: 150, h: 100 } },
    { id: 'trend', label: 'Trend', grid: { x: 250, y: 50, w: 200, h: 150 } },
    { id: 'notes', label: 'Notes', grid: { x: 50, y: 250, w: 250, h: 100 } },
];

const cloneDefault = () =>
    defaultLayout.map((item) => ({
        ...item,
        grid: { ...item.grid },
    }));

const readSavedLayout = () => {
    if (typeof localStorage === 'undefined') return cloneDefault();

    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : cloneDefault();
};

const layout = ref(readSavedLayout());
const status = ref('Move or resize a widget to save.');

const saveLayout = () => {
    localStorage.setItem(storageKey, JSON.stringify(layout.value));
    status.value = `Saved ${new Date().toLocaleTimeString()}`;
};

const resetLayout = () => {
    layout.value = cloneDefault();
    saveLayout();
};
</script>
