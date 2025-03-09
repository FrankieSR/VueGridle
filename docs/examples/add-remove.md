---
outline: deep
---

# 03. Add and Remove Example

---

<div class="demo-container">
    <Example03AddRemove />
</div>

## Example Code

```vue
<template>
    <div class="simple-grid-container">
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
                @item-activated="activeItemId = item.id"
                @item-deactivated="activeItemId = null"
            >
                <div class="grid-item-content">
                    {{ item.label }}
                    <button
                        v-if="activeItemId === item.id"
                        class="remove-button"
                        @click="removeItem(item.id)"
                    >
                        Remove
                    </button>
                </div>
            </GridItem>
        </Grid>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Grid from './Grid.vue';
import GridItem from './GridItem.vue';

const layout = ref([
    { id: 'item-1', label: 'Item 1', grid: { x: 50, y: 50, w: 100, h: 100 } },
    { id: 'item-2', label: 'Item 2', grid: { x: 200, y: 200, w: 100, h: 100 } },
]);

const activeItemId = ref<string | null>(null);

const addItem = () => {
    const newId = `item-${layout.value.length + 1}`;
    layout.value.push({
        id: newId,
        label: `Item ${layout.value.length + 1}`,
        grid: { x: 50 + layout.value.length * 20, y: 50 + layout.value.length * 20, w: 100, h: 100 },
    });
};

const removeItem = (id: string) => {
    const index = layout.value.findIndex(item => item.id === id);
    if (index !== -1) {
        layout.value.splice(index, 1);
        activeItemId.value = null; // Сбрасываем активный элемент после удаления
    }
};
</script>

<style scoped>
.simple-grid-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
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
    position: relative;
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
</style>
```

## Source

- [View on GitHub](https://github.com/username/repo/blob/main/docs/.vitepress/components/Example03AddRemove.vue)

