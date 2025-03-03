import { type Ref } from 'vue';

export interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface GridNode {
    id: string;
    grid: Rect;
}

export interface ContextItem {
    onMouseMove: (event: MouseEvent | TouchEvent) => void;
    onMouseUp: () => void;
    id: string;
    rect: Rect;
}

export interface GridContext {
    gridContainer: Ref<HTMLElement | null>;
    gridWidth: Ref<number>;
    gridHeight: Ref<number>;
    gridCellSize: Ref<number>;
    isManipulating: Ref<boolean>;
    setActiveItem: (item: ContextItem) => void;
    updateActiveItemRect: (rect: Rect) => void;
    clearActiveItem: () => void;
    activeItemId: Ref<string | null>;
    activeItemRect: Ref<Rect | null>;
}

export interface GridItemProps {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    freeDrag?: boolean;
    resizable?: boolean;
    draggable?: boolean;
    nodeId: string;
    allNodes: GridNode[];
    modelValue: Rect;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
}

export interface GridItemEmits {
    (e: 'dragStart'): void;
    (e: 'dragStop', x: number, y: number): void;
    (e: 'drag', x: number, y: number): void;
    (e: 'resizeStart'): void;
    (e: 'resize', x: number, y: number, w: number, h: number): void;
    (e: 'resizeStop', x: number, y: number, w: number, h: number): void;
    (e: 'update:modelValue', value: Rect): void;
    (e: 'itemActivated', nodeId: string): void;
    (e: 'itemDeactivated', nodeId: string): void;
    (e: 'drop', nodeId: string, x: number, y: number): void;
    (e: 'collisionDetected', collidingIds: string[]): void;
}
