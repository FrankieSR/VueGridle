import { computed, inject, type Ref } from 'vue';
import { gridSnapWithinBounds, checkCollision, isCollision } from '@/utils/gridUtils';
import { clamp } from '@/utils/helpers';
import { gridContextKey } from '@/context/gridContext';
import {
    type GridItemEmits,
    type GridItemProps,
    type GridKeyboard,
    type GridNode,
} from '@/types/gridTypes';

const ARROW_KEYS = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'] as const;
type ArrowKey = (typeof ARROW_KEYS)[number];

const isArrowKey = (key: string): key is ArrowKey => ARROW_KEYS.includes(key as ArrowKey);

const isInteractiveElement = (target: EventTarget | null): boolean => {
    if (!(target instanceof HTMLElement)) return false;

    return (
        target.isContentEditable ||
        ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)
    );
};

export function useGridKeyboard(
    props: GridItemProps,
    position: Ref<{ x: number; y: number }>,
    size: Ref<{ w: number; h: number }>,
    emit: GridItemEmits,
    activate: () => void,
): GridKeyboard {
    const gridContext = inject(gridContextKey);

    if (!gridContext) {
        throw new Error('VueGridle: GridItem must be rendered inside a Grid component.');
    }

    const allNodes = computed(() => props.allNodes ?? gridContext.allNodes.value);

    const getKeyboardStep = () => Math.max(1, gridContext.gridCellSize.value);

    const emitCollision = (rect: { x: number; y: number; w: number; h: number }) => {
        const collidingIds = allNodes.value
            .filter((node: GridNode) => node.id !== props.nodeId && isCollision(rect, node.grid))
            .map((node) => node.id);

        if (collidingIds.length > 0) {
            emit('collisionDetected', collidingIds);
        }
    };

    const moveByKey = (key: ArrowKey) => {
        if (!props.draggable) return;

        const step = getKeyboardStep();
        const deltaX = key === 'ArrowRight' ? step : key === 'ArrowLeft' ? -step : 0;
        const deltaY = key === 'ArrowDown' ? step : key === 'ArrowUp' ? -step : 0;
        const { w, h } = size.value;
        const maxX = gridContext.gridWidth.value - w;
        const maxY = gridContext.gridHeight.value - h;
        const nextX = position.value.x + deltaX;
        const nextY = position.value.y + deltaY;
        const newX = props.freeDrag
            ? clamp(nextX, 0, maxX)
            : gridSnapWithinBounds(nextX, 0, maxX, step);
        const newY = props.freeDrag
            ? clamp(nextY, 0, maxY)
            : gridSnapWithinBounds(nextY, 0, maxY, step);

        if (newX === position.value.x && newY === position.value.y) return;

        const nextRect = { x: newX, y: newY, w, h };
        const hasCollision = checkCollision(
            props.nodeId,
            newX,
            newY,
            w,
            h,
            allNodes.value,
            props.freeDrag ?? false,
        );

        if (hasCollision && !props.freeDrag) {
            emitCollision(nextRect);
            return;
        }

        gridContext.isManipulating.value = true;
        gridContext.setActiveItem({
            onPointerMove: () => {},
            onPointerUp: () => {},
            id: props.nodeId,
            rect: nextRect,
        });
        emit('dragStart');

        position.value = { x: newX, y: newY };
        gridContext.updateActiveItemRect(nextRect);
        emit('drag', newX, newY);
        emit('dragStop', newX, newY);
        emit('update:modelValue', { ...nextRect });
        emit('drop', props.nodeId, newX, newY);

        gridContext.isManipulating.value = false;
        gridContext.clearActiveItem();
    };

    const resizeByKey = (key: ArrowKey) => {
        if (!props.resizable) return;

        const step = getKeyboardStep();
        const minWidth = props.minWidth ?? 50;
        const minHeight = props.minHeight ?? 50;
        const gridMaxWidth = gridContext.gridWidth.value - position.value.x;
        const gridMaxHeight = gridContext.gridHeight.value - position.value.y;
        const maxWidth =
            props.maxWidth !== undefined ? Math.min(props.maxWidth, gridMaxWidth) : gridMaxWidth;
        const maxHeight =
            props.maxHeight !== undefined
                ? Math.min(props.maxHeight, gridMaxHeight)
                : gridMaxHeight;

        const nextW =
            key === 'ArrowRight'
                ? size.value.w + step
                : key === 'ArrowLeft'
                  ? size.value.w - step
                  : size.value.w;
        const nextH =
            key === 'ArrowDown'
                ? size.value.h + step
                : key === 'ArrowUp'
                  ? size.value.h - step
                  : size.value.h;
        const newW = props.freeDrag
            ? clamp(nextW, minWidth, maxWidth)
            : gridSnapWithinBounds(nextW, minWidth, maxWidth, step);
        const newH = props.freeDrag
            ? clamp(nextH, minHeight, maxHeight)
            : gridSnapWithinBounds(nextH, minHeight, maxHeight, step);

        if (newW === size.value.w && newH === size.value.h) return;

        const nextRect = { x: position.value.x, y: position.value.y, w: newW, h: newH };
        const hasCollision =
            !props.freeDrag &&
            checkCollision(
                props.nodeId,
                nextRect.x,
                nextRect.y,
                nextRect.w,
                nextRect.h,
                allNodes.value,
                props.freeDrag ?? false,
            );

        if (hasCollision) {
            emitCollision(nextRect);
            return;
        }

        gridContext.isManipulating.value = true;
        gridContext.setActiveItem({
            onPointerMove: () => {},
            onPointerUp: () => {},
            id: props.nodeId,
            rect: nextRect,
        });
        emit('resizeStart');

        size.value = { w: newW, h: newH };
        gridContext.updateActiveItemRect(nextRect);
        emit('resize', nextRect.x, nextRect.y, nextRect.w, nextRect.h);
        emit('resizeStop', nextRect.x, nextRect.y, nextRect.w, nextRect.h);
        emit('update:modelValue', { ...nextRect });

        gridContext.isManipulating.value = false;
        gridContext.clearActiveItem();
    };

    const handleKeydown = (event: KeyboardEvent) => {
        if (event.target !== event.currentTarget && isInteractiveElement(event.target)) return;

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            activate();
            return;
        }

        if (!isArrowKey(event.key)) return;

        event.preventDefault();
        activate();

        if (event.shiftKey) {
            resizeByKey(event.key);
            return;
        }

        moveByKey(event.key);
    };

    return {
        handleKeydown,
    };
}
