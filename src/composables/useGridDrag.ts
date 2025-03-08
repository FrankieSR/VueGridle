import { ref, inject, type Ref } from 'vue';
import { gridSnap, checkCollision, isCollision } from '@/utils/gridUtils';
import { clamp, getClientCoordinates } from '@/utils/helpers';
import { addGlobalListeners, removeGlobalListeners } from '@/utils/eventListeners';
import {
    type GridItemProps,
    type GridItemEmits,
    type GridContext,
    type GridNode,
    type GridDrag,
} from '@/types/gridTypes';

export function useGridDrag(
    props: GridItemProps,
    position: Ref<{ x: number; y: number }>,
    emit: GridItemEmits,
): GridDrag {
    const DRAG_THRESHOLD = 5;
    const DEFAULT_SIZE = 50;
    const gridContext = inject<GridContext>('gridContext')!;

    const isDragging = ref(false);
    const dragInitiated = ref(false);
    const startMouse = ref<{ x: number; y: number }>({ x: 0, y: 0 });
    const startPosition = ref<{ x: number; y: number }>({ x: 0, y: 0 });

    let rafId: number | null = null;
    let latestEvent: MouseEvent | TouchEvent | null = null;

    const startDrag = (event: MouseEvent | TouchEvent) => {
        if (!props.draggable) return;

        const { clientX, clientY } = getClientCoordinates(event);
        startMouse.value = { x: clientX, y: clientY };
        startPosition.value = { ...position.value };

        isDragging.value = true;

        addGlobalListeners(onMouseMove, stopDrag);
    };

    const updateDrag = (event: MouseEvent | TouchEvent) => {
        if (!isDragging.value) return;

        const { clientX, clientY } = getClientCoordinates(event);
        const deltaX = clientX - startMouse.value.x;
        const deltaY = clientY - startMouse.value.y;

        if (!dragInitiated.value && Math.sqrt(deltaX * deltaX + deltaY * deltaY) > DRAG_THRESHOLD) {
            gridContext.isManipulating.value = true;
            dragInitiated.value = true;

            gridContext.setActiveItem({
                onMouseMove,
                onMouseUp: stopDrag,
                id: props.nodeId,
                rect: { ...position.value, w: props.w ?? DEFAULT_SIZE, h: props.h ?? DEFAULT_SIZE },
            });
            emit('dragStart');
        }

        if (!dragInitiated.value) return;

        const w = props.w ?? DEFAULT_SIZE;
        const h = props.h ?? DEFAULT_SIZE;
        let newX = clamp(startPosition.value.x + deltaX, 0, gridContext.gridWidth.value - w);
        let newY = clamp(startPosition.value.y + deltaY, 0, gridContext.gridHeight.value - h);

        newX = props.freeDrag ? newX : gridSnap(newX, gridContext.gridCellSize.value);
        newY = props.freeDrag ? newY : gridSnap(newY, gridContext.gridCellSize.value);

        if (
            checkCollision(props.nodeId, newX, newY, w, h, props.allNodes, props.freeDrag ?? false)
        ) {
            const collidingIds = props.allNodes
                .filter(
                    (node: GridNode) =>
                        node.id !== props.nodeId &&
                        isCollision({ x: newX, y: newY, w, h }, node.grid),
                )
                .map((node) => node.id);
            emit('collisionDetected', collidingIds);
        }

        if (
            props.freeDrag ||
            !checkCollision(props.nodeId, newX, newY, w, h, props.allNodes, props.freeDrag ?? false)
        ) {
            position.value = { x: newX, y: newY };
            if (props.nodeId === gridContext.activeItemId.value) {
                gridContext.updateActiveItemRect({ x: newX, y: newY, w, h });
            }
            emit('drag', newX, newY);
        }
    };

    const onMouseMove = (event: MouseEvent | TouchEvent) => {
        latestEvent = event;
        if (rafId === null && isDragging.value) {
            rafId = requestAnimationFrame(() => {
                if (latestEvent) {
                    updateDrag(latestEvent);
                    latestEvent = null;
                }
                rafId = null;
            });
        }
    };

    const stopDrag = () => {
        if (!isDragging.value) return;

        isDragging.value = false;
        gridContext.isManipulating.value = false;

        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }

        latestEvent = null;
        removeGlobalListeners(onMouseMove, stopDrag);
        gridContext.clearActiveItem();

        if (dragInitiated.value) {
            emit('dragStop', position.value.x, position.value.y);
            emit('update:modelValue', {
                x: position.value.x,
                y: position.value.y,
                w: props.w ?? DEFAULT_SIZE,
                h: props.h ?? DEFAULT_SIZE,
            });
            emit('drop', props.nodeId, position.value.x, position.value.y);
        }

        dragInitiated.value = false;
    };

    return {
        isDragging,
        startDrag,
    };
}
