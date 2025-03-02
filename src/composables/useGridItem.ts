import { ref, type Ref } from 'vue';
import { useGridDrag } from './gridDrag';
import { useGridResize } from './gridResize';
import { useGridState } from './gridState';
import { useGridActivation } from './gridActivation';

export function useGridItem(props: any, emit: any) {
    const item = ref<HTMLElement | null>(null);

    const { position, size, isActive, isNearActive, itemStyle } = useGridState(props, emit);
    const { isDragging, startDrag } = useGridDrag(props, position, emit);
    const { isResizing, startResize, resizeHandles } = useGridResize(props, position, size, emit);
    const { activateItem } = useGridActivation(props, emit);

    return {
        item,
        isDragging,
        isResizing,
        isActive,
        isNearActive,
        itemStyle,
        startDrag,
        startResize,
        activateItem,
        resizeHandles,
    };
}
