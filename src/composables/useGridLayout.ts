import { ref, reactive, type Ref } from 'vue';
import { type GridNode } from '@/types/gridTypes';

export function useGridLayout(initialItems: GridNode[] = []) {
    const itemMap = reactive(
        new Map<string, GridNode>(initialItems.map((item) => [item.id, { ...item }])),
    );

    const items: Ref<GridNode[]> = ref(Array.from(itemMap.values()));

    const updateItemPosition = (nodeId: string, x: number, y: number) => {
        const item = itemMap.get(nodeId);
        if (!item) {
            console.warn(`Item with id "${nodeId}" not found`);
            return;
        }
        itemMap.set(nodeId, {
            ...item,
            grid: { ...item.grid, x, y },
        });
        items.value = Array.from(itemMap.values());
    };

    const updateItemRect = (nodeId: string, x: number, y: number, w: number, h: number) => {
        const item = itemMap.get(nodeId);
        if (!item) {
            console.warn(`Item with id "${nodeId}" not found`);
            return;
        }
        itemMap.set(nodeId, {
            ...item,
            grid: { x, y, w, h },
        });
        items.value = Array.from(itemMap.values());
    };

    return {
        items,
        updateItemPosition,
        updateItemRect,
    };
}
