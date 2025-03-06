import { inject, onMounted, onUnmounted, type Ref } from 'vue';
import { type GridItemProps, type GridItemEmits, type GridContext } from '@/types/gridTypes';

export function useGridActivation(
    props: GridItemProps,
    emit: GridItemEmits,
    item: Ref<HTMLElement | null>,
    isDragging: Ref<boolean>,
    isResizing: Ref<boolean>,
) {
    const gridContext = inject<GridContext>('gridContext')!;

    const setActiveItem = () => {
        gridContext.setActiveItem({
            onMouseMove: () => {},
            onMouseUp: () => {},
            id: props.nodeId,
            rect: {
                x: props.x ?? 0,
                y: props.y ?? 0,
                w: props.w ?? 200,
                h: props.h ?? 100,
            },
        });
    };

    const activateItem = () => {
        if (isDragging.value || isResizing.value) return;

        setActiveItem();

        emit('itemActivated', props.nodeId);
    };

    const handleOutsideClick = (event: MouseEvent) => {
        if (!item || !item.value || item.value.contains(event.target as Node)) return;
        if (gridContext.activeItemId.value === props.nodeId) {
            gridContext.clearActiveItem();

            emit('itemDeactivated', props.nodeId);
        }
    };

    onMounted(() => {
        document.addEventListener('click', handleOutsideClick);
    });

    onUnmounted(() => {
        document.removeEventListener('click', handleOutsideClick);
    });

    return {
        activateItem,
    };
}
