import { ref, inject } from 'vue';
import { gridSnap, checkCollision, isCollision } from '@/utils/gridUtils';
import { clamp, getClientCoordinates } from '@/utils/helpers';
import { addGlobalListeners, removeGlobalListeners } from '@/utils/eventListeners';

export function useGridDrag(props: any, position: any, emit: any) {
    const gridContext = inject('gridContext') as any;

    const isDragging = ref(false);
    const startMouse = ref({ x: 0, y: 0 });
    const startPosition = ref({ x: 0, y: 0 });

    let rafId: number | null = null;
    let latestEvent: MouseEvent | TouchEvent | null = null;

    const startDrag = (event: MouseEvent | TouchEvent) => {
        if (!props.draggable) return;
        isDragging.value = true;
        gridContext.isManipulating.value = true;

        const { clientX, clientY } = getClientCoordinates(event);
        startMouse.value = { x: clientX, y: clientY };
        startPosition.value = { ...position.value };

        // Устанавливаем активный элемент с обработчиками
        gridContext.setActiveItem({
            onMouseMove,
            onMouseUp: stopDrag,
            id: props.nodeId,
            rect: { ...position.value, w: props.w, h: props.h },
        });

        // Добавляем глобальные слушатели
        addGlobalListeners(onMouseMove, stopDrag);
        emit('dragStart');
    };

    const updateDrag = (event: MouseEvent | TouchEvent) => {
        if (!isDragging.value) return; // Предотвращаем вызов после остановки

        const { clientX, clientY } = getClientCoordinates(event);
        const deltaX = clientX - startMouse.value.x;
        const deltaY = clientY - startMouse.value.y;

        let newX = clamp(startPosition.value.x + deltaX, 0, gridContext.gridWidth.value - props.w);
        let newY = clamp(startPosition.value.y + deltaY, 0, gridContext.gridHeight.value - props.h);

        newX = props.freeDrag ? newX : gridSnap(newX, gridContext.gridCellSize.value);
        newY = props.freeDrag ? newY : gridSnap(newY, gridContext.gridCellSize.value);

        if (checkCollision(props.nodeId, newX, newY, props.w, props.h, props.allNodes)) {
            const collidingIds = props.allNodes
                .filter(
                    (node: any) =>
                        node.id !== props.nodeId &&
                        isCollision({ x: newX, y: newY, w: props.w, h: props.h }, node.grid),
                )
                .map((node: any) => node.id);
            emit('collisionDetected', collidingIds);
        }

        if (
            props.freeDrag ||
            !checkCollision(props.nodeId, newX, newY, props.w, props.h, props.allNodes)
        ) {
            position.value = { x: newX, y: newY };
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
        if (!isDragging.value) return; // Предотвращаем повторный вызов
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
            w: props.w,
            h: props.h,
        });
        emit('drop', props.nodeId, position.value.x, position.value.y);
    };

    return {
        isDragging,
        startDrag,
    };
}
