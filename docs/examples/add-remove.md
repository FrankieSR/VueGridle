---
outline: deep
---

# Add and Remove Example

Add and remove items while keeping layout state controlled in one array.

---

<div class="demo-container">
    <Example03AddRemove />
</div>

## Example Code

```vue
<template>
    <div class="example-shell">
        <div class="example-toolbar">
            <button class="example-button" type="button" @click="addItem">Add widget</button>
            <span>{{ layout.length }} widgets</span>
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
                @item-activated="activeItemId = item.id"
                @item-deactivated="activeItemId = null"
            >
                <div class="grid-item-content">
                    <span>{{ item.label }}</span>
                    <button
                        v-if="activeItemId === item.id"
                        class="remove-button"
                        type="button"
                        @pointerdown.stop
                        @click.stop="removeItem(item.id)"
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
    import { Grid, GridItem } from 'vuegridle';
    import 'vuegridle/style.css';

    const layout = ref([
        { id: 'item-1', label: 'Revenue', grid: { x: 50, y: 50, w: 150, h: 100 } },
        { id: 'item-2', label: 'Orders', grid: { x: 250, y: 150, w: 150, h: 100 } },
    ]);

    const activeItemId = ref<string | null>(null);
    let nextItemNumber = 3;

    const addItem = () => {
        const id = `item-${nextItemNumber}`;
        const offset = (nextItemNumber - 1) * 30;

        layout.value.push({
            id,
            label: `Widget ${nextItemNumber}`,
            grid: { x: 50 + offset, y: 50 + offset, w: 150, h: 100 },
        });
        nextItemNumber += 1;
    };

    const removeItem = (id: string) => {
        layout.value = layout.value.filter((item) => item.id !== id);
        if (activeItemId.value === id) {
            activeItemId.value = null;
        }
    };
</script>

<style scoped>
    .remove-button {
        position: absolute;
        top: 8px;
        right: 8px;
        padding: 4px 8px;
        border: 0;
        border-radius: 4px;
        background: #ef4444;
        color: #fff;
        cursor: pointer;
        font-size: 12px;
    }
</style>
```

## Source

- [View on GitHub](https://github.com/FrankieSR/VueGridle/blob/main/docs/.vitepress/components/Example03AddRemove.vue)
