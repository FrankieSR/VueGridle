import { ref, reactive, type Ref } from 'vue';

interface GridNode {
    id: string;
    grid: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
}

/**
 * Creates a reactive grid layout manager using a Map for efficient item access.
 * @param initialItems Initial array of grid items (default: empty array)
 * @returns Object with items ref and manipulation methods
 */
export function useGridLayout(initialItems: GridNode[] = []) {
    const itemMap = reactive(
        new Map<string, GridNode>(initialItems.map((item) => [item.id, { ...item }])),
    );

    const items: Ref<GridNode[]> = ref(Array.from(itemMap.values()));

    /**
     * Updates the position of an item in the grid.
     * @param nodeId ID of the item to update
     * @param x New x-coordinate
     * @param y New y-coordinate
     */
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

    /**
     * Updates the full rectangle (position and size) of an item in the grid.
     * @param nodeId ID of the item to update
     * @param x New x-coordinate
     * @param y New y-coordinate
     * @param w New width
     * @param h New height
     */
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
