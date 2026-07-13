<template>
    <div class="example-shell">
        <div class="example-toolbar">
            <button class="example-button" type="button" @click="addItem">Add widget</button>
            <span>{{ layout.length }} widgets</span>
        </div>

        <div ref="gridFrame" class="add-remove-grid-frame">
            <Grid :gridCellSize="CELL_SIZE" :layout="layout" class="grid-demo">
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
    </div>
</template>

<script setup lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';

    const CELL_SIZE = 50;
    const ITEM_WIDTH = 150;
    const ITEM_HEIGHT = 100;
    const DEFAULT_GRID_WIDTH = 640;
    const DEFAULT_GRID_HEIGHT = 500;
    const EDGE_INSET = 2;

    const layout = ref([
        { id: 'item-1', label: 'Revenue', grid: { x: 0, y: 0, w: ITEM_WIDTH, h: ITEM_HEIGHT } },
        {
            id: 'item-2',
            label: 'Orders',
            grid: { x: ITEM_WIDTH, y: ITEM_HEIGHT, w: ITEM_WIDTH, h: ITEM_HEIGHT },
        },
    ]);

    const gridFrame = ref<HTMLElement | null>(null);
    const gridWidth = ref(DEFAULT_GRID_WIDTH);
    const gridHeight = ref(DEFAULT_GRID_HEIGHT);
    const activeItemId = ref<string | null>(null);
    let nextItemNumber = 3;
    let resizeObserver: ResizeObserver | null = null;

    const getMaxX = () =>
        Math.max(
            0,
            Math.floor((gridWidth.value - ITEM_WIDTH - EDGE_INSET) / CELL_SIZE) * CELL_SIZE,
        );

    const getMaxY = () =>
        Math.max(
            0,
            Math.floor((gridHeight.value - ITEM_HEIGHT - EDGE_INSET) / CELL_SIZE) * CELL_SIZE,
        );

    const clampGridRect = (grid: { x: number; y: number; w: number; h: number }) => ({
        ...grid,
        x: Math.min(grid.x, getMaxX()),
        y: Math.min(grid.y, getMaxY()),
    });

    const doesOverlap = (
        a: { x: number; y: number; w: number; h: number },
        b: { x: number; y: number; w: number; h: number },
    ) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

    const getSlotRect = (slot: number) => {
        const columns = Math.max(1, Math.floor((getMaxX() + ITEM_WIDTH) / ITEM_WIDTH));
        const rows = Math.max(1, Math.floor((getMaxY() + ITEM_HEIGHT) / ITEM_HEIGHT));
        const capacity = Math.max(1, columns * rows);
        const normalizedSlot = slot % capacity;
        const column = normalizedSlot % columns;
        const row = Math.floor(normalizedSlot / columns);

        return {
            x: Math.min(column * ITEM_WIDTH, getMaxX()),
            y: Math.min(row * ITEM_HEIGHT, getMaxY()),
            w: ITEM_WIDTH,
            h: ITEM_HEIGHT,
        };
    };

    const getNextGridRect = () => {
        const columns = Math.max(1, Math.floor((getMaxX() + ITEM_WIDTH) / ITEM_WIDTH));
        const rows = Math.max(1, Math.floor((getMaxY() + ITEM_HEIGHT) / ITEM_HEIGHT));
        const capacity = Math.max(1, columns * rows);
        const startSlot = nextItemNumber - 1;

        for (let index = 0; index < capacity; index += 1) {
            const candidate = getSlotRect(startSlot + index);

            if (!layout.value.some((item) => doesOverlap(candidate, item.grid))) {
                return candidate;
            }
        }

        return getSlotRect(startSlot);
    };

    const updateGridSize = () => {
        if (!gridFrame.value) return;

        const gridElement = gridFrame.value.querySelector<HTMLElement>('.grid-demo');

        gridWidth.value =
            gridElement?.clientWidth || gridFrame.value.clientWidth || DEFAULT_GRID_WIDTH;
        gridHeight.value =
            gridElement?.clientHeight || gridFrame.value.clientHeight || DEFAULT_GRID_HEIGHT;
        layout.value = layout.value.map((item) => ({
            ...item,
            grid: clampGridRect(item.grid),
        }));
    };

    const addItem = () => {
        const id = `item-${nextItemNumber}`;

        layout.value.push({
            id,
            label: `Widget ${nextItemNumber}`,
            grid: getNextGridRect(),
        });
        nextItemNumber += 1;
    };

    const removeItem = (id: string) => {
        layout.value = layout.value.filter((item) => item.id !== id);
        if (activeItemId.value === id) {
            activeItemId.value = null;
        }
    };

    onMounted(() => {
        updateGridSize();

        resizeObserver = new ResizeObserver(updateGridSize);
        if (gridFrame.value) {
            resizeObserver.observe(gridFrame.value);
        }
    });

    onUnmounted(() => {
        resizeObserver?.disconnect();
    });
</script>

<style scoped>
    .add-remove-grid-frame {
        width: 100%;
        max-width: 640px;
    }

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
