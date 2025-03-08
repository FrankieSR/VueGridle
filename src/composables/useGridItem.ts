import { ref, type Ref } from 'vue';
import { useGridDrag } from './useGridDrag';
import { useGridResize } from './useGridResize';
import { useGridState } from './useGridState';
import { useGridActivation } from './useGridActivation';
import {
    type GridItemProps,
    type GridItemEmits,
    type GridState,
    type GridDrag,
    type GridResize,
    type GridActivation,
    type GridItemReturn,
} from '@/types/gridTypes';

export function useGridItem(props: GridItemProps, emit: GridItemEmits): GridItemReturn {
    const item = ref<HTMLElement | null>(null);

    const { position, size, isActive, isNearActive, itemStyle }: GridState = useGridState(props, emit);
    const { isDragging, startDrag }: GridDrag = useGridDrag(props, position, emit);
    const { isResizing, startResize, resizeHandles }: GridResize = useGridResize(props, position, size, emit);
    const { activate }: GridActivation = useGridActivation(props, emit, item, isDragging, isResizing, {
        position,
        size,
    });

    return {
        item,
        isDragging,
        isResizing,
        isActive,
        isNearActive,
        itemStyle,
        startDrag,
        startResize,
        activate,
        resizeHandles,
    };
}

export { useGridDrag, useGridResize, useGridState, useGridActivation };