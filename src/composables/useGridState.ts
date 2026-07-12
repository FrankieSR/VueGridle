import { ref, computed, inject, watch, type ComputedRef, type Ref, type CSSProperties } from 'vue';
import { gridSnap } from '@/utils/gridUtils';
import { gridContextKey } from '@/context/gridContext';
import {
    type GridItemProps,
    type GridItemEmits,
    type GridState,
    type Rect,
} from '@/types/gridTypes';

export function useGridState(props: GridItemProps, emit: GridItemEmits): GridState {
    const gridContext = inject(gridContextKey);

    if (!gridContext) {
        throw new Error('VueGridle: GridItem must be rendered inside a Grid component.');
    }

    const position: Ref<{ x: number; y: number }> = ref({
        x: props.x ?? 0,
        y: props.y ?? 0,
    });
    const size: Ref<{ w: number; h: number }> = ref({
        w: props.w ?? 200,
        h: props.h ?? 100,
    });

    const PROXIMITY_DEFAULT_THRESHOLD = 150;

    const isActive: ComputedRef<boolean> = computed(
        () => gridContext.activeItemId.value === props.nodeId,
    );

    const itemStyle: ComputedRef<CSSProperties> = computed(() => ({
        width: `${size.value.w}px`,
        height: `${size.value.h}px`,
        '--vuegridle-x': `${position.value.x}px`,
        '--vuegridle-y': `${position.value.y}px`,
        zIndex: props.z ?? 1,
    }));

    const isNearActive: ComputedRef<boolean> = computed(() => {
        if (!gridContext.activeItemRect.value || gridContext.activeItemId.value === props.nodeId) {
            return false;
        }
        const myRect = {
            x: position.value.x,
            y: position.value.y,
            w: size.value.w,
            h: size.value.h,
        };

        return (
            getRectDistance(myRect, gridContext.activeItemRect.value) <=
            (props.proximity || PROXIMITY_DEFAULT_THRESHOLD)
        );
    });

    const getRectDistance = (rect1: Rect, rect2: Rect): number => {
        const dx = Math.max(rect2.x - (rect1.x + rect1.w), rect1.x - (rect2.x + rect2.w), 0);
        const dy = Math.max(rect2.y - (rect1.y + rect1.h), rect1.y - (rect2.y + rect2.h), 0);
        return Math.sqrt(dx * dx + dy * dy);
    };

    const syncFromProps = () => {
        const source = props.modelValue ?? {
            x: props.x ?? 0,
            y: props.y ?? 0,
            w: props.w ?? 200,
            h: props.h ?? 100,
        };

        position.value = {
            x: props.freeDrag
                ? source.x
                : gridSnap(source.x, gridContext.gridCellSize.value),
            y: props.freeDrag
                ? source.y
                : gridSnap(source.y, gridContext.gridCellSize.value),
        };
        size.value = {
            w: props.freeDrag
                ? source.w
                : gridSnap(source.w, gridContext.gridCellSize.value),
            h: props.freeDrag
                ? source.h
                : gridSnap(source.h, gridContext.gridCellSize.value),
        };
    };

    watch(
        () => [
            props.modelValue?.x,
            props.modelValue?.y,
            props.modelValue?.w,
            props.modelValue?.h,
            props.x,
            props.y,
            props.w,
            props.h,
            props.freeDrag,
            gridContext.gridCellSize.value,
        ],
        syncFromProps,
        { immediate: true },
    );

    return {
        position,
        size,
        isActive,
        isNearActive,
        itemStyle,
    };
}
