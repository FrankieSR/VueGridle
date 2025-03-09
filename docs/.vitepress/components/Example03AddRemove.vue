<template>
    <div class="simple-grid-container">
        <div class="grid-wrapper">
            <button class="add-button" @click="addItem">Add Item</button>
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
                    @item-activated="setActiveItem(item.id)"
                >
                    <div class="grid-item-content">
                        {{ item.label }}
                        <button
                            v-if="activeItemId === item.id"
                            class="remove-button"
                            @click.stop="removeItem(item.id)"
                        >
                            Remove
                        </button>
                    </div>
                </GridItem>
            </Grid>
        </div>

        <div class="console-panel">
            <div class="console-body">
                <pre>{{ formattedLayout }}</pre>

        </div>
    </div>
</div>

</template>
<script setup lang="ts">
import { ref, computed } from 'vue';

const layout = ref([
    { id: 'item-1', label: 'Item 1', grid: { x: 50, y: 50, w: 100, h: 100 } },
    { id: 'item-2', label: 'Item 2', grid: { x: 200, y: 200, w: 100, h: 100 } },
]);

const activeItemId = ref<string | null>(null);

const formattedLayout = computed(() => {
    return JSON.stringify(layout.value, null, 2);
});

const setActiveItem = (id: string) => {
    activeItemId.value = id;
};

const addItem = () => {
    const newId = `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`; 
    layout.value.push({
        id: newId,
        label: `Item ${layout.value.length + 1}`,
        grid: { x: 50, y: 50, w: 100, h: 100 },
    });
};

const removeItem = (id: string) => {
    const index = layout.value.findIndex((item) => item.id === id);
    if (index !== -1) {
        layout.value.splice(index, 1);
        if (activeItemId.value === id) {
            activeItemId.value = null; 
        }
        console.log('Updated layout:', layout.value);
    }
};
</script>
<style scoped>
.simple-grid-container {
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

.add-button {
    padding: 8px 16px;
    margin-bottom: 20px;
    background-color: #6ee7b7;
    color: #1e2229;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
}

.add-button:hover {
    background-color: #4ade80;
}

.remove-button {
    position: absolute;
    top: 5px;
    right: 5px;
    padding: 4px 8px;
    background-color: #ff6b6b;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
}

.remove-button:hover {
    background-color: #ff8787;
}

pre {
    margin: 0;
    white-space: pre-wrap;
    word-wrap: break-word;
}
</style>

