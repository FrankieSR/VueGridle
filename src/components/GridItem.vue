<template>
    <div
        ref="item"
        class="vuegridle-grid-item"
        :class="{
            'vuegridle-active': isActive,
            'vuegridle-dragging': isDragging,
            'vuegridle-resizing': isResizing,
            'vuegridle-highlight': isNearActive,
        }"
        :style="itemStyle"
        @mousedown="startDrag"
        @touchstart="startDrag"
        @click="activate"
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
    import { type GridItemProps, type GridItemEmits } from '@/types/gridTypes';

    const props = withDefaults(defineProps<GridItemProps>(), {
        x: 0,
        y: 0,
        w: 200,
        h: 100,
        freeDrag: false,
        resizable: true,
        draggable: true,
        nodeId: '',
        allNodes: () => [],
        minWidth: 50,
        minHeight: 50,
        z: 1,
    });

    const emit = defineEmits<GridItemEmits>();

    const {
        item,
        isDragging,
        isResizing,
        isActive,
        isNearActive,
        itemStyle,
        startDrag,
        startResize,
        activate,
        resizeHandles,
    } = useGridItem(props, emit);
</script>
