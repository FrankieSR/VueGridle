import { ref, type Ref } from 'vue';
import { useGridDrag } from './gridDrag';
import { useGridResize } from './gridResize';
import { useGridState } from './gridState';
import { useGridActivation } from './gridActivation';
import { type GridItemProps, type GridItemEmits } from '@/types/gridTypes';

interface GridState {
    position: Ref<{ x: number; y: number }>;
    size: Ref<{ w: number; h: number }>;
    isActive: Ref<boolean>;
    isNearActive: Ref<boolean>;
    itemStyle: Ref<{ width: string; height: string; transform: string }>;
}

interface GridDrag {
    isDragging: Ref<boolean>;
    startDrag: (event: MouseEvent | TouchEvent) => void;
}

interface GridResize {
    isResizing: Ref<boolean>;
    startResize: (direction: string, event: MouseEvent | TouchEvent) => void;
    resizeHandles: readonly ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
}

interface GridActivation {
    activateItem: () => void;
}

export function useGridItem(props: GridItemProps, emit: GridItemEmits) {
    const item = ref<HTMLElement | null>(null);

    const { position, size, isActive, isNearActive, itemStyle }: GridState = useGridState(
        props,
        emit,
    );
    const { isDragging, startDrag }: GridDrag = useGridDrag(props, position, emit);
    const { isResizing, startResize, resizeHandles }: GridResize = useGridResize(
        props,
        position,
        size,
        emit,
    );
    const { activateItem }: GridActivation = useGridActivation(
        props,
        emit,
        item,
        isDragging,
        isResizing,
    );

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
