<template>
    <div
        ref="gridContainer"
        class="vuegridle-grid-container"
        :class="{ 'vuegridle-grid-active': isManipulating }"
        :style="{ '--grid-cell-size': `${gridCellSize}px` }"
        @dragover.prevent
        @pointermove="handlePointerMove"
        @pointerup="handlePointerUp"
        @pointercancel="handlePointerUp"
    >
        <slot :gridWidth="gridWidth" :gridHeight="gridHeight" :gridCellSize="gridCellSize" />
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, provide, onMounted, onUnmounted } from 'vue';
import { type GridContext, type Rect, type ContextItem, type GridNode } from '@/types/gridTypes';
import { gridContextKey } from '@/context/gridContext';
import { createCollisionIndex } from '@/utils/gridUtils';

const props = defineProps<{
    gridCellSize?: number;
    layout?: GridNode[];
}>();

const gridCellSize = computed(() => props.gridCellSize ?? 50);
const allNodes = computed(() => props.layout ?? []);
const collisionIndex = computed(() => createCollisionIndex(allNodes.value, gridCellSize.value));

const gridContainer = ref<HTMLElement | null>(null);
const gridWidth = ref<number>(0);
const gridHeight = ref<number>(0);

const isManipulating = ref<boolean>(false);
const activeItemId = ref<string | null>(null);
const activeItemRect = ref<Rect | null>(null);

const activeItem = ref<{
    onPointerMove: (event: PointerEvent) => void;
    onPointerUp: () => void;
} | null>(null);

let rAF: number | null = null;
let resizeObserver: ResizeObserver | null = null;

const updateSize = () => {
    if (gridContainer.value) {
        gridWidth.value = gridContainer.value.clientWidth;
        gridHeight.value = gridContainer.value.clientHeight;
    }
};

const setActiveItem = (item: ContextItem) => {
    activeItem.value = { onPointerMove: item.onPointerMove, onPointerUp: item.onPointerUp };
    activeItemId.value = item.id;
    activeItemRect.value = item.rect;
};

const updateActiveItemRect = (rect: Rect) => {
    activeItemRect.value = rect;
};

const clearActiveItem = () => {
    activeItem.value = null;
    activeItemId.value = null;
    activeItemRect.value = null;
};

provide(gridContextKey, {
    gridContainer,
    gridWidth,
    gridHeight,
    gridCellSize,
    allNodes,
    collisionIndex,
    isManipulating,
    setActiveItem,
    updateActiveItemRect,
    clearActiveItem,
    activeItemId,
    activeItemRect,
});

const handlePointerMove = (event: PointerEvent) => {
    if (rAF === null && activeItem.value) {
        rAF = requestAnimationFrame(() => {
            if (activeItem.value) {
                activeItem.value.onPointerMove(event);
            }
            rAF = null;
        });
    }
};

const handlePointerUp = () => {
    if (activeItem.value) {
        activeItem.value.onPointerUp();
    }
};

const handleOutsideClick = (event: MouseEvent) => {
    if (!gridContainer.value?.contains(event.target as Node) && activeItemId.value) {
        clearActiveItem();
    }
};

onMounted(() => {
    if (gridContainer.value) {
        updateSize();
        resizeObserver = new ResizeObserver(() => {
            updateSize();
        });
        resizeObserver.observe(gridContainer.value);
    }
    document.addEventListener('click', handleOutsideClick, { passive: true });
});

onUnmounted(() => {
    if (resizeObserver && gridContainer.value) {
        resizeObserver.unobserve(gridContainer.value);
    }
    document.removeEventListener('click', handleOutsideClick);
    activeItem.value = null;
});
</script>
