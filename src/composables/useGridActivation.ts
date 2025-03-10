import { inject, onMounted, onUnmounted, watch, type Ref } from 'vue';
import {
    type GridItemProps,
    type GridItemEmits,
    type GridContext,
    type GridActivation,
} from '@/types/gridTypes';

export function useGridActivation(
    props: GridItemProps,
    emit: GridItemEmits,
    item: Ref<HTMLElement | null>,
    isDragging: Ref<boolean>,
    isResizing: Ref<boolean>,
    options: {
        position?: Ref<{ x: number; y: number }>;
        size?: Ref<{ w: number; h: number }>;
        onMouseMove?: (event: MouseEvent | TouchEvent) => void;
        onMouseUp?: () => void;
    } = {},
): GridActivation {
    const gridContext = inject<GridContext>('gridContext')!;
    const { position, size, onMouseMove, onMouseUp } = options;

    const setActiveItem = () => {
        const rect = {
            x: position?.value.x ?? props.x ?? 0,
            y: position?.value.y ?? props.y ?? 0,
            w: size?.value.w ?? props.w ?? 200,
            h: size?.value.h ?? props.h ?? 100,
        };

        gridContext.setActiveItem({
            onMouseMove: onMouseMove ?? (() => {}),
            onMouseUp: onMouseUp ?? (() => {}),
            id: props.nodeId,
            rect,
        });
    };

    const activate = () => {
        if (isDragging.value || isResizing.value) return;

        setActiveItem();
        emit('itemActivated', props.nodeId);
    };

    watch(
        () => gridContext.activeItemId.value,
        (newActiveId, oldActiveId) => {
            if (oldActiveId === props.nodeId && newActiveId !== props.nodeId) {
                emit('itemDeactivated', props.nodeId);
            }
        },
        { flush: 'post' },
    );

    return {
        activate,
    };
}
