import { ref, inject, computed } from 'vue';
import { gridSnap, checkCollision, isCollision } from '@/utils/gridUtils';
import { clamp, getClientCoordinates } from '@/utils/helpers';
import { addGlobalListeners, removeGlobalListeners } from '@/utils/eventListeners';

export function useGridResize(props: any, position: any, size: any, emit: any) {
    const gridContext = inject('gridContext') as any;

    const isResizing = ref(false);
    const resizeDirection = ref<string | null>(null);
    const startMouse = ref({ x: 0, y: 0 });
    const startSize = ref({ w: 0, h: 0 });
    const startPosition = ref({ x: 0, y: 0 });
    const resizeHandles = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

    const directionSet = computed(() => {
        return new Set<string>((resizeDirection.value || '').split('-'));
    });

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
        const { clientX, clientY } = getClientCoordinates(event);
        const deltaX = clientX - startMouse.value.x;
        const deltaY = clientY - startMouse.value.y;

        const newRect = {
            x: startPosition.value.x,
            y: startPosition.value.y,
            w: startSize.value.w,
            h: startSize.value.h,
        };

        const directions = directionSet.value;

        if (directions.size > 0) {
            if (directions.has('right')) {
                newRect.w = clamp(newRect.w + deltaX, 50, gridContext.gridWidth.value - newRect.x);
            }
            if (directions.has('left')) {
                const rightEdge = startPosition.value.x + startSize.value.w;
                newRect.x = clamp(startPosition.value.x + deltaX, 0, rightEdge - 50);
                newRect.w = rightEdge - newRect.x;
            }
            if (directions.has('bottom')) {
                newRect.h = clamp(newRect.h + deltaY, 50, gridContext.gridHeight.value - newRect.y);
            }
            if (directions.has('top')) {
                const bottomEdge = startPosition.value.y + startSize.value.h;
                newRect.y = clamp(startPosition.value.y + deltaY, 0, bottomEdge - 50);
                newRect.h = bottomEdge - newRect.y;
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
            collidingIds = props.allNodes.reduce((ids: string[], node: any) => {
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
        if (rafId === null) {
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
        isResizing.value = false;
        gridContext.isManipulating.value = false;
        removeGlobalListeners(onMouseMove, stopResize);
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
