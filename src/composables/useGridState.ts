import { ref, computed, inject, onMounted } from 'vue';
import { gridSnap } from '@/utils/gridUtils';
import { type GridItemProps, type GridItemEmits } from '@/types/gridTypes';

export function useGridState(props: GridItemProps, emit: GridItemEmits) {
    const gridContext = inject<any>('gridContext')!;

    const position = ref({
        x: props.x ?? 0,
        y: props.y ?? 0,
    });
    const size = ref({
        w: props.w ?? 200,
        h: props.h ?? 100,
    });

    const isActive = computed(() => gridContext.activeItemId.value === props.nodeId);

    const itemStyle = computed(() => ({
        width: `${size.value.w}px`,
        height: `${size.value.h}px`,
        transform: `translate3d(${position.value.x}px, ${position.value.y}px, 0)`,
        zIndex: props.z ?? 1,
    }));

    const PROXIMITY_THRESHOLD = 150;

    const isNearActive = computed(() => {
        if (!gridContext.activeItemRect.value || gridContext.activeItemId.value === props.nodeId) {
            return false;
        }
        const myRect = {
            x: position.value.x,
            y: position.value.y,
            w: size.value.w,
            h: size.value.h,
        };
        return getRectDistance(myRect, gridContext.activeItemRect.value) < PROXIMITY_THRESHOLD;
    });

    const getRectDistance = (rect1: any, rect2: any) => {
        const dx = Math.max(rect2.x - (rect1.x + rect1.w), rect1.x - (rect2.x + rect2.w), 0);
        const dy = Math.max(rect2.y - (rect1.y + rect1.h), rect1.y - (rect2.y + rect2.h), 0);

        return Math.sqrt(dx * dx + dy * dy);
    };

    onMounted(() => {
        position.value = {
            x: props.freeDrag
                ? (props.x ?? 0)
                : gridSnap(props.x ?? 0, gridContext.gridCellSize.value),
            y: props.freeDrag
                ? (props.y ?? 0)
                : gridSnap(props.y ?? 0, gridContext.gridCellSize.value),
        };
        size.value = {
            w: props.freeDrag
                ? (props.w ?? 200)
                : gridSnap(props.w ?? 200, gridContext.gridCellSize.value),
            h: props.freeDrag
                ? (props.h ?? 100)
                : gridSnap(props.h ?? 100, gridContext.gridCellSize.value),
        };
    });

    return {
        position,
        size,
        isActive,
        isNearActive,
        itemStyle,
    };
}
