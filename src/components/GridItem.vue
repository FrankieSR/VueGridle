<template>
    <div
        ref="item"
        class="grid-item"
        :class="{
            active: isActive,
            dragging: isDragging,
            resizing: isResizing,
            highlight: isNearActive,
        }"
        :style="itemStyle"
        @mousedown="startDrag"
        @touchstart="startDrag"
        @click="activateItem"
        @contextmenu.prevent
        @dragstart.prevent
    >
        <slot />
        <template v-if="isActive && resizable">
            <div
                v-for="handle in resizeHandles"
                :key="handle"
                class="resize-handle"
                :class="handle"
                @mousedown.stop="startResize(handle, $event)"
                @touchstart.stop="startResize(handle, $event)"
            ></div>
        </template>
    </div>
</template>

<script lang="ts" setup>
    import { useGridItem } from '@/composables/useGridItem';

    const props = withDefaults(
        defineProps<{
            x?: number;
            y?: number;
            w?: number;
            h?: number;
            freeDrag?: boolean;
            resizable?: boolean;
            draggable?: boolean;
            nodeId: string;
            allNodes: any[];
            modelValue: { x: number; y: number; w: number; h: number };
        }>(),
        {
            x: 0,
            y: 0,
            w: 200,
            h: 100,
            freeDrag: false,
            resizable: true,
            draggable: true,
            nodeId: '',
            allNodes: () => [],
        },
    );

    const emit = defineEmits<{
        (e: 'dragStart'): void;
        (e: 'dragStop', x: number, y: number): void;
        (e: 'drag', x: number, y: number): void;
        (e: 'resizeStart'): void;
        (e: 'resize', x: number, y: number, w: number, h: number): void;
        (e: 'resizeStop', x: number, y: number, w: number, h: number): void;
        (e: 'update:modelValue', value: { x: number; y: number; w: number; h: number }): void;
        (e: 'itemActivated', nodeId: string): void;
        (e: 'itemDeactivated', nodeId: string): void;
        (e: 'drop', nodeId: string, x: number, y: number): void;
        (e: 'collisionDetected', nodeId: string, collidingIds: string[]): void;
    }>();

    const {
        item,
        isDragging,
        isResizing,
        isActive,
        isNearActive,
        itemStyle,
        startDrag,
        startResize,
        activateItem,
        resizeHandles,
    } = useGridItem(props, emit);
</script>

<style scoped>
    .grid-item {
        position: absolute;
        box-sizing: border-box;
        cursor: grab;
        background-color: var(--grid-item-bg-color);
        transition: var(--grid-item-transition);
        will-change: transform, box-shadow;
    }

    .grid-item:hover {
        box-shadow: var(--grid-item-shadow);
        transform: translateY(var(--grid-item-hover-lift));
    }

    .dragging {
        opacity: var(--grid-item-dragging-opacity);
        cursor: grabbing;
        transform: scale(var(--grid-item-dragging-scale));
        box-shadow: var(--grid-item-dragging-shadow);
    }

    .resizing {
        box-shadow: var(--grid-item-resizing-shadow);
    }

    .resize-handle {
        width: var(--resize-handle-size);
        height: var(--resize-handle-size);
        background: var(--resize-handle-bg-color);
        position: absolute;
        z-index: 10;
        border-radius: 50%;
        opacity: var(--resize-handle-opacity);
        transition: var(--resize-handle-transition);
    }

    .resize-handle:hover {
        opacity: var(--resize-handle-hover-opacity);
        transform: scale(var(--resize-handle-hover-scale));
    }

    .top-left {
        top: var(--resize-handle-offset);
        left: var(--resize-handle-offset);
        cursor: nwse-resize;
    }

    .top-right {
        top: var(--resize-handle-offset);
        right: var(--resize-handle-offset);
        cursor: nesw-resize;
    }

    .bottom-left {
        bottom: var(--resize-handle-offset);
        left: var(--resize-handle-offset);
        cursor: nesw-resize;
    }

    .bottom-right {
        bottom: var(--resize-handle-offset);
        right: var(--resize-handle-offset);
        cursor: nwse-resize;
    }

    .grid-item.highlight {
        border: 3px solid var(--grid-item-border-color);
    }

    .grid-item.active {
        border: 1px solid var(--grid-item-border-color);
        box-shadow: var(--grid-item-active-shadow);
    }
</style>
