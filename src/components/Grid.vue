<template>
    <div
        ref="gridContainer"
        class="grid-container"
        :class="{ 'grid-active': isManipulating }"
        @dragover.prevent
        @mousemove="handlePointerMove"
        @touchmove.prevent="handlePointerMove"
    >
        <slot :gridWidth="gridWidth" :gridHeight="gridHeight" :gridCellSize="gridCellSize" />
    </div>
</template>

<script lang="ts" setup>
    import { ref, provide, onMounted, onUnmounted } from 'vue';

    const props = defineProps<{ gridCellSize?: number }>();

    const DEFAULT_GRID_SIZE = 50;

    const gridContainer = ref<HTMLElement | null>(null);
    const gridWidth = ref(0);
    const gridHeight = ref(0);
    const gridCellSize = ref(props.gridCellSize ?? DEFAULT_GRID_SIZE);

    const isManipulating = ref(false);
    const activeItemId = ref<string | null>(null);
    const activeItemRect = ref<{ x: number; y: number; w: number; h: number } | null>(null);

    const activeItem = ref<{
        onMouseMove: (event: MouseEvent | TouchEvent) => void;
        onMouseUp: () => void;
    } | null>(null);

    let rAF: number | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const updateSize = () => {
        if (gridContainer.value) {
            gridWidth.value = gridContainer.value.clientWidth;
            gridHeight.value = gridContainer.value.clientHeight;
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
    });

    onUnmounted(() => {
        if (resizeObserver && gridContainer.value) {
            resizeObserver.unobserve(gridContainer.value);
        }
        activeItem.value = null;
    });

    provide('gridContext', {
        gridContainer,
        gridWidth,
        gridHeight,
        gridCellSize,
        isManipulating,
        setActiveItem: (item: any) => {
            activeItem.value = item;
            activeItemId.value = item.id;
            activeItemRect.value = item.rect;
        },
        updateActiveItemRect: (rect: { x: number; y: number; w: number; h: number }) => {
            activeItemRect.value = rect;
        },
        clearActiveItem: () => {
            activeItem.value = null;
            activeItemId.value = null;
            activeItemRect.value = null;
        },
        activeItemId,
        activeItemRect,
    });

    const handlePointerMove = (event: MouseEvent | TouchEvent) => {
        console.log('Pointer move triggered', event);
        if (rAF === null) {
            rAF = requestAnimationFrame(() => {
                if (activeItem.value) {
                    activeItem.value.onMouseMove(event);
                }
                rAF = null;
            });
        }
    };
</script>

<style scoped>
    .grid-container {
        position: relative;
        width: 100%;
        height: 100%;
        transition: 0.1s ease-in-out;
        background-color: white;
    }

    .grid-active {
        background: rgba(230, 240, 255, 0.95);
        background-image:
            linear-gradient(
                0deg,
                transparent 48px,
                rgba(120, 150, 255, 0.2) 49px,
                rgba(120, 150, 255, 0.2) 50px,
                transparent 51px
            ),
            linear-gradient(
                90deg,
                transparent 48px,
                rgba(120, 150, 255, 0.2) 49px,
                rgba(120, 150, 255, 0.2) 50px,
                transparent 51px
            );
        background-size: 50px 50px;
        box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
    }
</style>
