import { ref, computed, inject, type Ref } from 'vue';
import { gridSnap, checkCollision, isCollision } from '@/utils/gridUtils';
import { clamp, getClientCoordinates } from '@/utils/helpers';
import { addGlobalListeners, removeGlobalListeners } from '@/utils/eventListeners';
import {
    type GridItemProps,
    type GridItemEmits,
    type GridContext,
    type GridNode,
} from '@/types/gridTypes';

export function useGridResize(
    props: GridItemProps,
    position: Ref<{ x: number; y: number }>,
    size: Ref<{ w: number; h: number }>,
    emit: GridItemEmits,
) {
    const gridContext = inject<GridContext>('gridContext')!;

    const DEFAULT_MAX_SIZE = 500;
    const DEFAULT_MIN_SIZE = 50;

    const isResizing = ref(false);
    const resizeDirection = ref<string | null>(null);
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
        const deltaX = clientX - startMouse.value.x;
        const deltaY = clientY - startMouse.value.y;

        const minWidth = props.minWidth ?? DEFAULT_MIN_SIZE;
        const minHeight = props.minHeight ?? DEFAULT_MIN_SIZE;
        const maxWidth = props.maxWidth ?? DEFAULT_MAX_SIZE;
        const maxHeight = props.maxHeight ?? DEFAULT_MAX_SIZE;

        const newRect = {
            x: startPosition.value.x,
            y: startPosition.value.y,
            w: startSize.value.w,
            h: startSize.value.h,
        };

        const directions = directionSet.value;
        if (directions.size > 0) {
            if (directions.has('right')) {
                newRect.w = clamp(
                    newRect.w + deltaX,
                    minWidth,
                    Math.min(maxWidth, gridContext.gridWidth.value - newRect.x),
                );
            }
            if (directions.has('left')) {
                const rightEdge = startPosition.value.x + startSize.value.w;
                newRect.x = clamp(startPosition.value.x + deltaX, 0, rightEdge - minWidth);
                newRect.w = clamp(rightEdge - newRect.x, minWidth, maxWidth);
            }
            if (directions.has('bottom')) {
                newRect.h = clamp(
                    newRect.h + deltaY,
                    minHeight,
                    Math.min(maxHeight, gridContext.gridHeight.value - newRect.y),
                );
            }
            if (directions.has('top')) {
                const bottomEdge = startPosition.value.y + startSize.value.h;
                newRect.y = clamp(startPosition.value.y + deltaY, 0, bottomEdge - minHeight);
                newRect.h = clamp(bottomEdge - newRect.y, minHeight, maxHeight);
            }
        }

        const snappedRect = {
            x: props.freeDrag ? newRect.x : gridSnap(newRect.x, gridContext.gridCellSize.value),
            y: props.freeDrag ? newRect.y : gridSnap(newRect.y, gridContext.gridCellSize.value),
            w: props.freeDrag ? newRect.w : gridSnap(newRect.w, gridContext.gridCellSize.value),
            h: props.freeDrag ? newRect.h : gridSnap(newRect.h, gridContext.gridCellSize.value),
        };

        let collidingIds: string[] = [];
        const hasCollision =
            !props.freeDrag &&
            checkCollision(
                props.nodeId,
                snappedRect.x,
                snappedRect.y,
                snappedRect.w,
                snappedRect.h,
                props.allNodes,
            );

        if (hasCollision) {
            collidingIds = props.allNodes.reduce((ids: string[], node: GridNode) => {
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

    return {
        isResizing,
        startResize,
        resizeHandles,
    };
}
