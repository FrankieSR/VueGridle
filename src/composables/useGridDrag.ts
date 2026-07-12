import { ref, computed, inject, onUnmounted, type Ref } from 'vue';
import { gridSnapWithinBounds, createCollisionIndex, getCollidingNodeIds } from '@/utils/gridUtils';
import { clamp, getClientCoordinates } from '@/utils/helpers';
import { addGlobalListeners, removeGlobalListeners } from '@/utils/eventListeners';
import { gridContextKey } from '@/context/gridContext';
import { type GridItemProps, type GridItemEmits, type GridDrag } from '@/types/gridTypes';

export function useGridDrag(
    props: GridItemProps,
    position: Ref<{ x: number; y: number }>,
    size: Ref<{ w: number; h: number }>,
    emit: GridItemEmits,
): GridDrag {
    const DRAG_THRESHOLD = 5;
    const gridContext = inject(gridContextKey);

    if (!gridContext) {
        throw new Error('VueGridle: GridItem must be rendered inside a Grid component.');
    }

    const isDragging = ref(false);
    const dragInitiated = ref(false);
    const allNodes = computed(() => props.allNodes ?? gridContext.allNodes.value);
    const collisionIndex = computed(() =>
        props.allNodes
            ? createCollisionIndex(props.allNodes, gridContext.gridCellSize.value)
            : gridContext.collisionIndex.value,
    );
    const startMouse = ref<{ x: number; y: number }>({ x: 0, y: 0 });
    const startPosition = ref<{ x: number; y: number }>({ x: 0, y: 0 });

    let rafId: number | null = null;
    let latestEvent: PointerEvent | null = null;
    let lastCollisionKey = '';

    const emitCollisionDetected = (collidingIds: string[]) => {
        if (collidingIds.length === 0) {
            lastCollisionKey = '';
            return;
        }

        const collisionKey = collidingIds.join('\0');
        if (collisionKey === lastCollisionKey) return;

        lastCollisionKey = collisionKey;
        emit('collisionDetected', collidingIds);
    };

    const startDrag = (event: PointerEvent) => {
        if (!props.draggable) return;
        if (event.button !== 0) return;

        event.preventDefault();

        const { clientX, clientY } = getClientCoordinates(event);
        startMouse.value = { x: clientX, y: clientY };
        startPosition.value = { ...position.value };

        isDragging.value = true;

        addGlobalListeners(onPointerMove, stopDrag);
    };

    const updateDrag = (event: PointerEvent) => {
        if (!isDragging.value) return;

        const { clientX, clientY } = getClientCoordinates(event);
        const deltaX = clientX - startMouse.value.x;
        const deltaY = clientY - startMouse.value.y;

        if (!dragInitiated.value && Math.sqrt(deltaX * deltaX + deltaY * deltaY) > DRAG_THRESHOLD) {
            gridContext.isManipulating.value = true;
            dragInitiated.value = true;

            gridContext.setActiveItem({
                onPointerMove,
                onPointerUp: stopDrag,
                id: props.nodeId,
                rect: { ...position.value, ...size.value },
            });
            emit('dragStart');
        }

        if (!dragInitiated.value) return;

        const { w, h } = size.value;
        const maxX = gridContext.gridWidth.value - w;
        const maxY = gridContext.gridHeight.value - h;
        const nextX = startPosition.value.x + deltaX;
        const nextY = startPosition.value.y + deltaY;

        const newX = props.freeDrag
            ? clamp(nextX, 0, maxX)
            : gridSnapWithinBounds(nextX, 0, maxX, gridContext.gridCellSize.value);
        const newY = props.freeDrag
            ? clamp(nextY, 0, maxY)
            : gridSnapWithinBounds(nextY, 0, maxY, gridContext.gridCellSize.value);

        if (newX === position.value.x && newY === position.value.y) return;

        const nodes = allNodes.value;

        const collidingIds = getCollidingNodeIds(
            props.nodeId,
            { x: newX, y: newY, w, h },
            nodes,
            props.freeDrag ?? false,
            collisionIndex.value,
        );
        const hasCollision = collidingIds.length > 0;

        emitCollisionDetected(collidingIds);

        if (props.freeDrag || !hasCollision) {
            position.value = { x: newX, y: newY };
            if (props.nodeId === gridContext.activeItemId.value) {
                gridContext.updateActiveItemRect({ x: newX, y: newY, w, h });
            }
            emit('drag', newX, newY);
        }
    };

    const onPointerMove = (event: PointerEvent) => {
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
        lastCollisionKey = '';
        removeGlobalListeners(onPointerMove, stopDrag);
        gridContext.clearActiveItem();

        if (dragInitiated.value) {
            emit('dragStop', position.value.x, position.value.y);
            emit('update:modelValue', {
                x: position.value.x,
                y: position.value.y,
                w: size.value.w,
                h: size.value.h,
            });
            emit('drop', props.nodeId, position.value.x, position.value.y);
        }

        dragInitiated.value = false;
    };

    onUnmounted(() => {
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }

        latestEvent = null;
        lastCollisionKey = '';
        removeGlobalListeners(onPointerMove, stopDrag);

        if (isDragging.value) {
            isDragging.value = false;
            dragInitiated.value = false;
            gridContext.isManipulating.value = false;
            gridContext.clearActiveItem();
        }
    });

    return {
        isDragging,
        startDrag,
    };
}
