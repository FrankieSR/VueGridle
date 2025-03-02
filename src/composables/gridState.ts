import { ref, computed, inject, onMounted } from 'vue';
import { gridSnap } from '@/utils/gridUtils';

export function useGridState(props: any, emit: any) {
    const gridContext = inject('gridContext') as any;

    const position = ref({ x: props.x, y: props.y });
    const size = ref({ w: props.w, h: props.h });

    const isActive = computed(() => gridContext.activeItemId.value === props.nodeId);

    const itemStyle = computed(() => ({
        width: `${size.value.w}px`,
        height: `${size.value.h}px`,
        transform: `translate3d(${position.value.x}px, ${position.value.y}px, 0)`,
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
            x: props.freeDrag ? props.x : gridSnap(props.x, gridContext.gridCellSize.value),
            y: props.freeDrag ? props.y : gridSnap(props.y, gridContext.gridCellSize.value),
        };
        size.value = {
            w: props.freeDrag ? props.w : gridSnap(props.w, gridContext.gridCellSize.value),
            h: props.freeDrag ? props.h : gridSnap(props.h, gridContext.gridCellSize.value),
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
