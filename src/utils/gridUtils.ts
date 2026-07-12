import { type CollisionIndex, type GridNode, type Rect } from '@/types/gridTypes';

const collisionIdsCache = new Map<string, string[]>();
let collisionIndexVersion = 0;
const MAX_COLLISION_CACHE_ENTRIES = 1000;

/**
 * Snaps a value to the nearest multiple of gridSize.
 *
 * @param value - The original value.
 * @param gridSize - The grid step size.
 * @returns The value snapped to the nearest grid point.
 */
export const gridSnap = (value: number, gridSize: number): number =>
    Math.round(value / gridSize) * gridSize;

export const gridSnapWithinBounds = (
    value: number,
    min: number,
    max: number,
    gridSize: number,
): number => {
    const boundedMax = Math.max(min, max);

    if (gridSize <= 0) {
        return Math.max(min, Math.min(value, boundedMax));
    }

    const snapped = gridSnap(value, gridSize);
    const minSnap = Math.ceil(min / gridSize) * gridSize;
    const maxSnap = Math.floor(boundedMax / gridSize) * gridSize;

    if (maxSnap < minSnap) {
        return Math.max(min, Math.min(snapped, boundedMax));
    }

    return Math.max(minSnap, Math.min(snapped, maxSnap));
};

/**
 * Checks if two rectangles intersect.
 *
 * @param rectA - The first rectangle.
 * @param rectB - The second rectangle.
 * @returns True if the rectangles intersect, false otherwise.
 */
export const isCollision = (rectA: Rect, rectB: Rect): boolean =>
    rectA.x < rectB.x + rectB.w &&
    rectA.x + rectA.w > rectB.x &&
    rectA.y < rectB.y + rectB.h &&
    rectA.y + rectA.h > rectB.y;

const getBucketKey = (x: number, y: number): string => `${x}:${y}`;

const getBucketRange = (rect: Rect, bucketSize: number) => {
    const size = Math.max(1, bucketSize);
    const minX = Math.floor(rect.x / size);
    const minY = Math.floor(rect.y / size);
    const maxX = Math.floor((rect.x + Math.max(0, rect.w - 1)) / size);
    const maxY = Math.floor((rect.y + Math.max(0, rect.h - 1)) / size);

    return { minX, minY, maxX, maxY };
};

export const createCollisionIndex = (nodes: GridNode[], bucketSize: number): CollisionIndex => {
    const buckets = new Map<string, GridNode[]>();

    for (const node of nodes) {
        const range = getBucketRange(node.grid, bucketSize);

        for (let x = range.minX; x <= range.maxX; x += 1) {
            for (let y = range.minY; y <= range.maxY; y += 1) {
                const key = getBucketKey(x, y);
                const bucket = buckets.get(key);

                if (bucket) {
                    bucket.push(node);
                } else {
                    buckets.set(key, [node]);
                }
            }
        }
    }

    const version = (collisionIndexVersion += 1);

    return {
        version,
        findCandidates(rect: Rect) {
            const candidates = new Set<GridNode>();
            const range = getBucketRange(rect, bucketSize);

            for (let x = range.minX; x <= range.maxX; x += 1) {
                for (let y = range.minY; y <= range.maxY; y += 1) {
                    const bucket = buckets.get(getBucketKey(x, y));

                    if (bucket) {
                        bucket.forEach((node) => candidates.add(node));
                    }
                }
            }

            return Array.from(candidates);
        },
    };
};

/**
 * Checks for collision of a given rectangle against other grid nodes.
 *
 * The function can use a spatial collision index to limit checks to nodes in nearby grid buckets.
 * Cache entries are scoped by the collision index version, so layout changes rebuild the index
 * without hashing every node on each pointer frame.
 *
 * Visualization of collision detection:
 *
 *      +------------------------+
 *      |        Node A          |
 *      |  (x:10, y:10, w:50, h:50)|
 *      |    +---------+         |   <-- Collision detected if Node B overlaps
 *      |    |  Node B |         |
 *      |    |(40,40,30,30)       |
 *      |    +---------+         |
 *      +------------------------+
 *
 * In this example, if Node B's rectangle overlaps with Node A's, the collision is detected.
 *
 * @param nodeId - The id of the current node.
 * @param x - The x-coordinate of the rectangle to check.
 * @param y - The y-coordinate of the rectangle to check.
 * @param w - The width of the rectangle.
 * @param h - The height of the rectangle.
 * @param nodes - Array of grid nodes to check against.
 * @returns True if a collision is detected, false otherwise.
 */
export const checkCollision = (
    nodeId: string,
    x: number,
    y: number,
    w: number,
    h: number,
    nodes: GridNode[],
    freeDrag: boolean,
    collisionIndex = createCollisionIndex(nodes, 50),
): boolean => {
    return getCollidingNodeIds(nodeId, { x, y, w, h }, nodes, freeDrag, collisionIndex).length > 0;
};

export const getCollidingNodeIds = (
    nodeId: string,
    rect: Rect,
    nodes: GridNode[],
    freeDrag: boolean,
    collisionIndex = createCollisionIndex(nodes, 50),
): string[] => {
    if (!nodes.some((node) => node.id !== nodeId)) return [];

    const cacheKey = `${collisionIndex.version}:${nodeId}:${rect.x},${rect.y},${rect.w},${rect.h}:${freeDrag}`;

    if (collisionIdsCache.has(cacheKey)) {
        return collisionIdsCache.get(cacheKey)!;
    }

    const collidingIds = collisionIndex
        .findCandidates(rect)
        .filter(({ id, grid, freeDrag: otherFreeDrag }) => {
            if (id === nodeId) return false;
            if (!freeDrag && otherFreeDrag) return false;

            return isCollision(rect, grid);
        })
        .map(({ id }) => id);

    if (collisionIdsCache.size >= MAX_COLLISION_CACHE_ENTRIES) {
        collisionIdsCache.clear();
    }

    collisionIdsCache.set(cacheKey, collidingIds);
    return collidingIds;
};

export const clearCollisionCache = (): void => {
    collisionIdsCache.clear();
};
