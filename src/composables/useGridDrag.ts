import { ref, inject, type Ref } from 'vue';
import { gridSnap, checkCollision, isCollision } from '@/utils/gridUtils';
import { clamp, getClientCoordinates } from '@/utils/helpers';
import { addGlobalListeners, removeGlobalListeners } from '@/utils/eventListeners';
import {
    type GridItemProps,
    type GridItemEmits,
    type GridContext,
    type GridNode,
} from '@/types/gridTypes';

export function useGridDrag(
    props: GridItemProps,
    position: Ref<{ x: number; y: number }>,
    emit: GridItemEmits,
) {
    const gridContext = inject<GridContext>('gridContext')!;

    const isDragging = ref(false);
    const startMouse = ref<{ x: number; y: number }>({ x: 0, y: 0 });
    const startPosition = ref<{ x: number; y: number }>({ x: 0, y: 0 });

    let rafId: number | null = null;
    let latestEvent: MouseEvent | TouchEvent | null = null;

    const startDrag = (event: MouseEvent | TouchEvent) => {
        if (!props.draggable) return;
        isDragging.value = true;
        gridContext.isManipulating.value = true;

        const { clientX, clientY } = getClientCoordinates(event);
        startMouse.value = { x: clientX, y: clientY };
        startPosition.value = { ...position.value };

        gridContext.setActiveItem({
            onMouseMove,
            onMouseUp: stopDrag,
            id: props.nodeId,
            rect: { ...position.value, w: props.w ?? 200, h: props.h ?? 100 },
        });

        addGlobalListeners(onMouseMove, stopDrag);
        emit('dragStart');
    };

    const updateDrag = (event: MouseEvent | TouchEvent) => {
        if (!isDragging.value) return;

        const { clientX, clientY } = getClientCoordinates(event);
        const deltaX = clientX - startMouse.value.x;
        const deltaY = clientY - startMouse.value.y;

        const w = props.w ?? 200;
        const h = props.h ?? 100;
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
            !checkCollision(
                props.nodeId,
                newX,
                newY,
                w,
                h,
                props.allNodes,
                props?.freeDrag ?? false,
            )
        ) {
            position.value = { x: newX, y: newY };
            if (props.nodeId === gridContext.activeItemId.value) {
                gridContext.updateActiveItemRect({
                    x: newX,
                    y: newY,
                    w: w,
                    h: h,
                });
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

        emit('dragStop', position.value.x, position.value.y);

        emit('update:modelValue', {
            x: position.value.x,
            y: position.value.y,
            w: props.w ?? 200,
            h: props.h ?? 100,
        });

        emit('drop', props.nodeId, position.value.x, position.value.y);
    };

    return {
        isDragging,
        startDrag,
    };
}
