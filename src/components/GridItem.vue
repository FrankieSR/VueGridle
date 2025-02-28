<template>
    <div
        ref="item"
        class="grid-item"
        :class="{
            active: isActiveComputed,
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
        <template v-if="isActiveComputed && resizable">
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
    import { ref, computed, inject, onMounted, onUnmounted, watch } from 'vue';
    import { gridSnap, checkCollision } from '@/utils/gridUtils';

    interface GridNode {
        id: string;
        grid: { x: number; y: number; w: number; h: number };
    }

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
            allNodes: GridNode[];
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
            allNodes: [],
        },
    );

    const emit = defineEmits<{
        (e: 'dragStart'): void;
        (e: 'dragStop', x: number, y: number): void;
        (e: 'drag', x: number, y: number): void;
        (e: 'resizeStart'): void;
        (e: 'resize', x: number, y: number, w: number, h: number): void;
        (e: 'resizeStop', x: number, y: number, w: number, h: number): void;
    }>();

    const gridContext = inject('gridContext') as {
        gridWidth: Ref<number>;
        gridHeight: Ref<number>;
        gridCellSize: Ref<number>;
        isManipulating: Ref<boolean>;
        setActiveItem: (item: any) => void;
        updateActiveItemRect: (rect: { x: number; y: number; w: number; h: number }) => void;
        clearActiveItem: () => void;
        activeItemId: Ref<string | null>;
        activeItemRect: Ref<{ x: number; y: number; w: number; h: number } | null>;
    };

    const item = ref<HTMLElement | null>(null);
    const position = ref({ x: props.x, y: props.y });
    const size = ref({ w: props.w, h: props.h });
    const isDragging = ref(false);
    const isResizing = ref(false);
    const resizeDirection = ref<string | null>(null);
    const startMouse = ref({ x: 0, y: 0 });
    const startSize = ref({ w: 0, h: 0 });
    const startPosition = ref({ x: 0, y: 0 });

    const isActiveComputed = computed(() => {
        return gridContext.activeItemId.value === props.nodeId;
    });

    const itemStyle = computed(() => ({
        width: `${size.value.w}px`,
        height: `${size.value.h}px`,
        transform: `translate3d(${position.value.x}px, ${position.value.y}px, 0)`,
    }));

    const resizeHandles = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

    const tempPosition = { x: 0, y: 0 };
    const tempSize = { w: 0, h: 0 };

    function getClientCoordinates(event: MouseEvent | TouchEvent): {
        clientX: number;
        clientY: number;
    } {
        if ('touches' in event && event.touches.length > 0) {
            return { clientX: event.touches[0].clientX, clientY: event.touches[0].clientY };
        } else if ('changedTouches' in event && event.changedTouches.length > 0) {
            return {
                clientX: event.changedTouches[0].clientX,
                clientY: event.changedTouches[0].clientY,
            };
        } else {
            return {
                clientX: (event as MouseEvent).clientX,
                clientY: (event as MouseEvent).clientY,
            };
        }
    }

    const clamp = (value: number, min: number, max: number): number =>
        Math.max(min, Math.min(max, value));

    const snapIfNeeded = (value: number): number =>
        props.freeDrag ? value : gridSnap(value, gridContext.gridCellSize.value);

    const addGlobalListeners = () => {
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('touchmove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('touchend', onMouseUp);
    };

    const removeGlobalListeners = () => {
        try {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('touchmove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('touchend', onMouseUp);
        } catch (error) {
            console.error('Error removing global listeners:', error);
        }
    };

    let rafId: number | null = null;
    let latestEvent: MouseEvent | TouchEvent | null = null;

    const onMouseMove = (event: MouseEvent | TouchEvent) => {
        latestEvent = event;
        if (rafId === null) {
            rafId = requestAnimationFrame(() => {
                if (latestEvent) {
                    if (isDragging.value) {
                        updateDrag(latestEvent);
                        emit('drag', position.value.x, position.value.y);
                    } else if (isResizing.value) {
                        updateResize(latestEvent);
                    }
                    if (props.nodeId === gridContext.activeItemId.value) {
                        gridContext.updateActiveItemRect({
                            x: position.value.x,
                            y: position.value.y,
                            w: size.value.w,
                            h: size.value.h,
                        });
                    }
                    latestEvent = null;
                }
                rafId = null;
            });
        }
    };

    const updateDrag = (event: MouseEvent | TouchEvent) => {
        if (!isDragging.value || !props.draggable) return;
        const { clientX, clientY } = getClientCoordinates(event);

        const deltaX = clientX - startMouse.value.x;
        const deltaY = clientY - startMouse.value.y;
        let newX = startPosition.value.x + deltaX;
        let newY = startPosition.value.y + deltaY;

        const maxX = gridContext.gridWidth.value - size.value.w;
        const maxY = gridContext.gridHeight.value - size.value.h;

        newX = clamp(newX, 0, maxX);
        newY = clamp(newY, 0, maxY);

        tempPosition.x = snapIfNeeded(newX);
        tempPosition.y = snapIfNeeded(newY);

        if (
            props.freeDrag ||
            !checkCollision(
                props.nodeId,
                tempPosition.x,
                tempPosition.y,
                size.value.w,
                size.value.h,
                props.allNodes,
            )
        ) {
            position.value.x = tempPosition.x;
            position.value.y = tempPosition.y;
            emit('drag', position.value.x, position.value.y);
        }
    };

    const updateResize = (event: MouseEvent | TouchEvent) => {
        if (!isResizing.value || !props.resizable) return;
        const { clientX, clientY } = getClientCoordinates(event);

        const deltaX = clientX - startMouse.value.x;
        const deltaY = clientY - startMouse.value.y;

        let newW = startSize.value.w;
        let newH = startSize.value.h;
        let newX = startPosition.value.x;
        let newY = startPosition.value.y;

        if (resizeDirection.value) {
            if (resizeDirection.value.includes('right')) {
                newW = Math.max(
                    50,
                    Math.min(startSize.value.w + deltaX, gridContext.gridWidth.value - newX),
                );
            }
            if (resizeDirection.value.includes('left')) {
                const rightEdge = startPosition.value.x + startSize.value.w;
                const potentialNewX = startPosition.value.x + deltaX;
                newX = clamp(potentialNewX, 0, rightEdge - 50);
                newW = Math.max(50, rightEdge - newX);
            }
            if (resizeDirection.value.includes('bottom')) {
                newH = Math.max(
                    50,
                    Math.min(startSize.value.h + deltaY, gridContext.gridHeight.value - newY),
                );
            }
            if (resizeDirection.value.includes('top')) {
                const bottomEdge = startPosition.value.y + startSize.value.h;
                const potentialNewY = startPosition.value.y + deltaY;
                newY = clamp(potentialNewY, 0, bottomEdge - 50);
                newH = Math.max(50, bottomEdge - newY);
            }
        }

        tempSize.w = snapIfNeeded(newW);
        tempSize.h = snapIfNeeded(newH);
        tempPosition.x = snapIfNeeded(newX);
        tempPosition.y = snapIfNeeded(newY);

        if (
            props.freeDrag ||
            !checkCollision(
                props.nodeId,
                tempPosition.x,
                tempPosition.y,
                tempSize.w,
                tempSize.h,
                props.allNodes,
            )
        ) {
            size.value.w = tempSize.w;
            size.value.h = tempSize.h;
            position.value.x = tempPosition.x;
            position.value.y = tempPosition.y;
            emit('resize', position.value.x, position.value.y, size.value.w, size.value.h);
        }
    };

    const onMouseUp = () => {
        if (isDragging.value) stopDrag();
        else if (isResizing.value) stopResize();
    };

    const startDrag = (event: MouseEvent | TouchEvent) => {
        if (!props.draggable) return;
        isDragging.value = true;
        gridContext.isManipulating.value = true;
        const { clientX, clientY } = getClientCoordinates(event);
        startMouse.value = { x: clientX, y: clientY };
        startPosition.value = { ...position.value };

        gridContext.setActiveItem({
            onMouseMove,
            onMouseUp,
            id: props.nodeId,
            rect: { x: position.value.x, y: position.value.y, w: size.value.w, h: size.value.h },
        });
        addGlobalListeners();
        emit('dragStart');
    };

    const stopDrag = () => {
        isDragging.value = false;
        gridContext.isManipulating.value = false;

        removeGlobalListeners();
        emit('dragStop', position.value.x, position.value.y);
    };

    const startResize = (direction: string, event: MouseEvent | TouchEvent) => {
        if (!props.resizable) return;
        isResizing.value = true;
        gridContext.isManipulating.value = true;
        resizeDirection.value = direction;
        const { clientX, clientY } = getClientCoordinates(event);
        startMouse.value = { x: clientX, y: clientY };
        startSize.value = { ...size.value };
        startPosition.value = { ...position.value };
        gridContext.setActiveItem({
            onMouseMove,
            onMouseUp,
            id: props.nodeId,
            rect: { x: position.value.x, y: position.value.y, w: size.value.w, h: size.value.h },
        });
        addGlobalListeners();
        emit('resizeStart');
    };

    const stopResize = () => {
        isResizing.value = false;
        gridContext.isManipulating.value = false;
        removeGlobalListeners();
        emit('resizeStop', position.value.x, position.value.y, size.value.w, size.value.h);
    };

    const activateItem = (event: MouseEvent) => {
        if (isDragging.value || isResizing.value) return;

        gridContext.setActiveItem({
            onMouseMove,
            onMouseUp,
            id: props.nodeId,
            rect: { x: position.value.x, y: position.value.y, w: size.value.w, h: size.value.h },
        });
    };

    function getRectDistance(
        rect1: { x: number; y: number; w: number; h: number },
        rect2: { x: number; y: number; w: number; h: number },
    ): number {
        const dx = Math.max(rect2.x - (rect1.x + rect1.w), rect1.x - (rect2.x + rect2.w), 0);
        const dy = Math.max(rect2.y - (rect1.y + rect1.h), rect1.y - (rect2.y + rect2.h), 0);
        return Math.sqrt(dx * dx + dy * dy);
    }

    const PROXIMITY_THRESHOLD = 150;

    const isNearActive = computed(() => {
        if (!gridContext.activeItemRect.value || gridContext.activeItemId.value === props.nodeId) {
            return false;
        }
        const myRect = {
            x: position.value.x,
            y: position.value.y,
            w: size.value.w,
            h: size.value.h,
        };
        const distance = getRectDistance(myRect, gridContext.activeItemRect.value);
        return distance >= 0 && distance < PROXIMITY_THRESHOLD;
    });

    watch(isNearActive, (newVal) => {
        console.log(`Element ${props.nodeId} is ${newVal ? '' : 'not '}near active element.`);
    });

    onMounted(() => {
        position.value = {
            x: props.freeDrag ? props.x : gridSnap(props.x, gridContext.gridCellSize.value),
            y: props.freeDrag ? props.y : gridSnap(props.y, gridContext.gridCellSize.value),
        };
        size.value = {
            w: props.freeDrag ? props.w : gridSnap(props.w, gridContext.gridCellSize.value),
            h: props.freeDrag ? props.h : gridSnap(props.h, gridContext.gridCellSize.value),
        };

        document.addEventListener('click', handleOutsideClick);
    });

    onUnmounted(() => {
        removeGlobalListeners();
        document.removeEventListener('click', handleOutsideClick);
    });

    const handleOutsideClick = (event: MouseEvent) => {
        if (item.value && !item.value.contains(event.target as Node)) {
            if (gridContext.activeItemId.value === props.nodeId) {
                gridContext.clearActiveItem();
            }
        }
    };
</script>

<style scoped>
    .grid-item {
        position: absolute;
        box-sizing: border-box;
        cursor: grab;
        transition: all 0.05s ease;
        will-change: transform, box-shadow;
    }

    .grid-item:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateY(-1px);
    }

    .dragging {
        opacity: 0.95;
        cursor: grabbing;
        transform: scale(1.02);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }

    .resizing {
        box-shadow: 0 4px 14px rgba(120, 150, 255, 0.3);
    }

    .resize-handle {
        width: 14px;
        height: 14px;
        background: rgba(120, 150, 255, 1);
        position: absolute;
        z-index: 10;
        border-radius: 50%;
        opacity: 0.7;
        transition: all 0.2s ease;
    }

    .resize-handle:hover {
        opacity: 1;
        transform: scale(1.2);
    }

    .top-left {
        top: -7px;
        left: -7px;
        cursor: nwse-resize;
    }

    .top-right {
        top: -7px;
        right: -7px;
        cursor: nesw-resize;
    }

    .bottom-left {
        bottom: -7px;
        left: -7px;
        cursor: nesw-resize;
    }

    .bottom-right {
        bottom: -7px;
        right: -7px;
        cursor: nwse-resize;
    }

    .grid-item.highlight {
        border: 1px solid blue;
    }

    .grid-item.active {
        border: 1px solid blue;
        box-shadow: 0 4px 12px rgba(120, 150, 255, 0.3);
    }
</style>
