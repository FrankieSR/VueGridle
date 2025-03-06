import { type GridNode } from '@/types/gridTypes';
interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
}

const collisionCache = new Map<string, boolean>();
let lastNodesHash = 0;

/**
 * Snaps a value to the nearest multiple of gridSize.
 *
 * @param value - The original value.
 * @param gridSize - The grid step size.
 * @returns The value snapped to the nearest grid point.
 */
export const gridSnap = (value: number, gridSize: number): number =>
    Math.round(value / gridSize) * gridSize;

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

/**
 * Computes a numerical hash for a string using the djb2 algorithm.
 *
 * The algorithm initializes with the value 5381 and, for each character in the string,
 * updates the hash as follows:
 *    hash = (hash * 33) ^ charCode;
 * Finally, it returns the hash as an unsigned 32-bit integer.
 *
 * @param s - The input string.
 * @returns The numerical hash of the string.
 */
const hashString = (s: string): number => {
    let hash = 5381;

    for (let i = 0; i < s.length; i++) {
        hash = (hash * 33) ^ s.charCodeAt(i);
    }
    return hash >>> 0;
};

/**
 * Generates a numerical hash representing the state of an array of grid nodes.
 *
 * For each node, it combines the hash of its id (using djb2) with its grid properties.
 * This allows quick determination if the nodes' state has changed.
 *
 * @param nodes - Array of grid nodes.
 * @returns The numerical hash representing the state of nodes.
 */
const generateNodesHash = (nodes: GridNode[]): number => {
    let hash = 0;
    for (const {
        id,
        grid: { x, y, w, h },
    } of nodes) {
        // Combine the id's hash with the numeric grid properties.
        hash = (hash << 5) - hash + hashString(id) + x + y + w + h;
        hash |= 0; // Convert to a 32-bit integer
    }
    return hash >>> 0;
};

/**
 * Checks for collision of a given rectangle against other grid nodes.
 *
 * The function uses caching to store results if the nodes' state hasn't changed.
 * It compares the numerical hash of the current nodes array to determine if the cache is still valid.
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
): boolean => {
    if (!nodes.some((node) => node.id !== nodeId)) return false;

    const cacheKey = `${nodeId}:${x},${y},${w},${h}:${freeDrag}`;
    const nodesHash = generateNodesHash(nodes);

    if (nodesHash !== lastNodesHash) {
        collisionCache.clear();
        lastNodesHash = nodesHash;
    }

    if (collisionCache.has(cacheKey)) {
        return collisionCache.get(cacheKey)!;
    }

    const rect: Rect = { x, y, w, h };
    const hasCollision = nodes.some(({ id, grid, freeDrag: otherFreeDrag }) => {
        if (id === nodeId) return false;
        if (!freeDrag && otherFreeDrag) return false;

        return isCollision(rect, grid);
    });

    collisionCache.set(cacheKey, hasCollision);
    return hasCollision;
};

export const clearCollisionCache = (): void => {
    collisionCache.clear();
};
