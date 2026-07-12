import { ref, computed, inject, onUnmounted, type Ref } from 'vue';
import { gridSnapWithinBounds, checkCollision, isCollision } from '@/utils/gridUtils';
import { clamp, getClientCoordinates } from '@/utils/helpers';
import { addGlobalListeners, removeGlobalListeners } from '@/utils/eventListeners';
import {
    type GridItemProps,
    type GridItemEmits,
    type GridContext,
    type GridNode,
    type GridResize,
} from '@/types/gridTypes';

export function useGridResize(
    props: GridItemProps,
    position: Ref<{ x: number; y: number }>,
    size: Ref<{ w: number; h: number }>,
    emit: GridItemEmits,
): GridResize {
    const DEFAULT_MIN_SIZE = 50;
    const gridContext = inject<GridContext>('gridContext');

    if (!gridContext) {
        throw new Error('VueGridle: GridItem must be rendered inside a Grid component.');
    }

    const isResizing = ref(false);
    const resizeDirection = ref<string | null>(null);
    const allNodes = computed(() => props.allNodes ?? gridContext.allNodes.value);
    const startMouse = ref<{ x: number; y: number }>({ x: 0, y: 0 });
    const startSize = ref<{ w: number; h: number }>({ w: 0, h: 0 });
    const startPosition = ref<{ x: number; y: number }>({ x: 0, y: 0 });

    const resizeHandles = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;

    const directionSet = computed(() => new Set<string>((resizeDirection.value || '').split('-')));

    let rafId: number | null = null;
    let latestEvent: MouseEvent | TouchEvent | null = null;

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
            onMouseUp: stopResize,
            id: props.nodeId,
            rect: { ...position.value, w: size.value.w, h: size.value.h },
        });

        addGlobalListeners(onMouseMove, stopResize);
        emit('resizeStart');
    };

    const updateResize = (event: MouseEvent | TouchEvent) => {
        if (!isResizing.value) return;

        const { clientX, clientY } = getClientCoordinates(event);
        const newRect = {
            x: position.value.x,
            y: position.value.y,
            w: size.value.w,
            h: size.value.h,
        };

        const deltaX = clientX - startMouse.value.x;
        const deltaY = clientY - startMouse.value.y;

        const minWidth = props.minWidth ?? DEFAULT_MIN_SIZE;
        const minHeight = props.minHeight ?? DEFAULT_MIN_SIZE;
        const gridMaxWidth = gridContext.gridWidth.value - newRect.x;
        const gridMaxHeight = gridContext.gridHeight.value - newRect.y;
        const maxWidth =
            props.maxWidth !== undefined ? Math.min(props.maxWidth, gridMaxWidth) : gridMaxWidth;
        const maxHeight =
            props.maxHeight !== undefined
                ? Math.min(props.maxHeight, gridMaxHeight)
                : gridMaxHeight;

        const directions = directionSet.value;

        if (directions.has('right')) {
            newRect.w = clamp(startSize.value.w + deltaX, minWidth, maxWidth);
        }
        if (directions.has('left')) {
            const rightEdge = startPosition.value.x + startSize.value.w;
            newRect.x = clamp(startPosition.value.x + deltaX, 0, rightEdge - minWidth);
            newRect.w = clamp(rightEdge - newRect.x, minWidth, maxWidth);
        }
        if (directions.has('bottom')) {
            newRect.h = clamp(startSize.value.h + deltaY, minHeight, maxHeight);
        }
        if (directions.has('top')) {
            const bottomEdge = startPosition.value.y + startSize.value.h;
            newRect.y = clamp(startPosition.value.y + deltaY, 0, bottomEdge - minHeight);
            newRect.h = clamp(bottomEdge - newRect.y, minHeight, maxHeight);
        }

        const gridCellSize = gridContext.gridCellSize.value;
        const snappedW = props.freeDrag
            ? newRect.w
            : gridSnapWithinBounds(newRect.w, minWidth, maxWidth, gridCellSize);
        const snappedH = props.freeDrag
            ? newRect.h
            : gridSnapWithinBounds(newRect.h, minHeight, maxHeight, gridCellSize);

        const snappedRect = {
            x: props.freeDrag
                ? newRect.x
                : gridSnapWithinBounds(newRect.x, 0, gridContext.gridWidth.value - snappedW, gridCellSize),
            y: props.freeDrag
                ? newRect.y
                : gridSnapWithinBounds(newRect.y, 0, gridContext.gridHeight.value - snappedH, gridCellSize),
            w: snappedW,
            h: snappedH,
        };

        let collidingIds: string[] = [];
        const nodes = allNodes.value;

        const hasCollision =
            !props.freeDrag &&
            checkCollision(
                props.nodeId,
                snappedRect.x,
                snappedRect.y,
                snappedRect.w,
                snappedRect.h,
                nodes,
                props.freeDrag ?? false,
            );

        if (hasCollision) {
            collidingIds = nodes.reduce((ids: string[], node: GridNode) => {
                if (node.id !== props.nodeId && isCollision(snappedRect, node.grid)) {
                    ids.push(node.id);
                }
                return ids;
            }, []);
            emit('collisionDetected', collidingIds);
        }

        if (props.freeDrag || !hasCollision) {
            position.value = { x: snappedRect.x, y: snappedRect.y };
            size.value = { w: snappedRect.w, h: snappedRect.h };

            if (props.nodeId === gridContext.activeItemId.value) {
                gridContext.updateActiveItemRect({
                    x: snappedRect.x,
                    y: snappedRect.y,
                    w: snappedRect.w,
                    h: snappedRect.h,
                });
            }
            emit('resize', snappedRect.x, snappedRect.y, snappedRect.w, snappedRect.h);
        }
    };

    const onMouseMove = (event: MouseEvent | TouchEvent) => {
        latestEvent = event;
        if (rafId === null && isResizing.value) {
            rafId = requestAnimationFrame(() => {
                if (latestEvent) {
                    updateResize(latestEvent);
                    latestEvent = null;
                }
                rafId = null;
            });
        }
    };

    const stopResize = () => {
        if (!isResizing.value) return;

        isResizing.value = false;
        gridContext.isManipulating.value = false;

        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
        latestEvent = null;
        removeGlobalListeners(onMouseMove, stopResize);
        gridContext.clearActiveItem();

        emit('resizeStop', position.value.x, position.value.y, size.value.w, size.value.h);
        emit('update:modelValue', {
            x: position.value.x,
            y: position.value.y,
            w: size.value.w,
            h: size.value.h,
        });
    };

    onUnmounted(() => {
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }

        latestEvent = null;
        removeGlobalListeners(onMouseMove, stopResize);

        if (isResizing.value) {
            isResizing.value = false;
            resizeDirection.value = null;
            gridContext.isManipulating.value = false;
            gridContext.clearActiveItem();
        }
    });

    return {
        isResizing,
        startResize,
        resizeHandles,
    };
}
