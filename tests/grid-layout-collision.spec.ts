import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, type PropType } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Grid from '@/components/Grid.vue';
import GridItem from '@/components/GridItem.vue';
import {
    checkCollision,
    clearCollisionCache,
    createCollisionIndex,
    getCollidingNodeIds,
} from '@/utils/gridUtils';
import { type GridNode, type Rect } from '@/types/gridTypes';

const createLayout = (secondX: number): GridNode[] => [
    { id: 'a', grid: { x: 0, y: 0, w: 100, h: 100 } },
    { id: 'b', grid: { x: secondX, y: 0, w: 100, h: 100 } },
];

const GridCollisionHarness = defineComponent({
    props: {
        layout: {
            type: Array as PropType<GridNode[]>,
            required: true,
        },
        overrideNodes: {
            type: Array as PropType<GridNode[] | undefined>,
            default: undefined,
        },
        onCollision: {
            type: Function as PropType<(ids: string[]) => void>,
            required: true,
        },
    },
    setup(props) {
        const updateNode = (node: GridNode, value: Rect) => {
            node.grid = value;
        };

        return () =>
            h(
                Grid,
                {
                    gridCellSize: 50,
                    layout: props.layout,
                },
                () =>
                    props.layout.map((node, index) =>
                        h(
                            GridItem,
                            {
                                key: node.id,
                                nodeId: node.id,
                                modelValue: node.grid,
                                draggable: true,
                                resizable: true,
                                ...(index === 0
                                    ? {
                                          allNodes: props.overrideNodes,
                                          onCollisionDetected: props.onCollision,
                                      }
                                    : {}),
                                'onUpdate:modelValue': (value: Rect) => updateNode(node, value),
                            },
                            () => node.id,
                        ),
                    ),
            );
    },
});

const dispatchPointerMove = (clientX: number, clientY: number) => {
    window.dispatchEvent(
        new MouseEvent('pointermove', {
            clientX,
            clientY,
            bubbles: true,
        }),
    );
};

const dispatchPointerDown = (element: Element, clientX: number, clientY: number) => {
    element.dispatchEvent(
        new MouseEvent('pointerdown', {
            button: 0,
            clientX,
            clientY,
            bubbles: true,
        }),
    );
};

describe('Grid layout collision context', () => {
    beforeEach(() => {
        clearCollisionCache();
        vi.stubGlobal(
            'ResizeObserver',
            class ResizeObserver {
                observe() {}
                unobserve() {}
                disconnect() {}
            },
        );
        vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
            callback(0);
            return 1;
        });
        vi.stubGlobal('cancelAnimationFrame', vi.fn());

        Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
            configurable: true,
            get() {
                return 500;
            },
        });
        Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
            configurable: true,
            get() {
                return 500;
            },
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('uses parent Grid layout for collision detection without GridItem allNodes', async () => {
        const onCollision = vi.fn();
        const wrapper = mount(GridCollisionHarness, {
            props: {
                layout: createLayout(100),
                onCollision,
            },
        });

        dispatchPointerDown(wrapper.findAll('.vuegridle-grid-item')[0].element, 0, 0);
        await nextTick();
        dispatchPointerMove(110, 0);
        await nextTick();

        expect(onCollision).toHaveBeenCalledWith(['b']);
    });

    it('keeps deprecated GridItem allNodes as an override over parent layout', async () => {
        const onCollision = vi.fn();
        const wrapper = mount(GridCollisionHarness, {
            props: {
                layout: createLayout(300),
                overrideNodes: [{ id: 'b', grid: { x: 100, y: 0, w: 100, h: 100 } }],
                onCollision,
            },
        });

        dispatchPointerDown(wrapper.findAll('.vuegridle-grid-item')[0].element, 0, 0);
        await nextTick();
        dispatchPointerMove(110, 0);
        await nextTick();

        expect(onCollision).toHaveBeenCalledWith(['b']);
    });

    it('moves a focused GridItem with arrow keys', async () => {
        const onCollision = vi.fn();
        const wrapper = mount(GridCollisionHarness, {
            props: {
                layout: createLayout(300),
                onCollision,
            },
        });
        const item = wrapper.findAll('.vuegridle-grid-item')[0];

        expect(item.attributes('tabindex')).toBe('0');
        expect(item.attributes('role')).toBe('group');
        expect(item.attributes('aria-label')).toBe('Grid item a');

        await item.trigger('keydown', {
            key: 'ArrowRight',
        });
        await nextTick();

        expect(wrapper.props('layout')[0].grid).toEqual({ x: 50, y: 0, w: 100, h: 100 });
    });

    it('resizes a focused GridItem with Shift and arrow keys', async () => {
        const onCollision = vi.fn();
        const wrapper = mount(GridCollisionHarness, {
            props: {
                layout: createLayout(300),
                onCollision,
            },
        });
        const item = wrapper.findAll('.vuegridle-grid-item')[0];

        await item.trigger('keydown', {
            key: 'ArrowRight',
            shiftKey: true,
        });
        await nextTick();

        expect(wrapper.props('layout')[0].grid).toEqual({ x: 0, y: 0, w: 150, h: 100 });
    });
});

describe('spatial collision index', () => {
    afterEach(() => {
        clearCollisionCache();
    });

    it('checks only nearby bucket candidates for large layouts', () => {
        const nodes: GridNode[] = [
            { id: 'active', grid: { x: 0, y: 0, w: 50, h: 50 } },
            { id: 'hit', grid: { x: 50, y: 0, w: 50, h: 50 } },
            ...Array.from({ length: 500 }, (_, index) => ({
                id: `far-${index}`,
                grid: {
                    x: 500 + (index % 50) * 100,
                    y: Math.floor(index / 50) * 100,
                    w: 50,
                    h: 50,
                },
            })),
        ];
        const index = createCollisionIndex(nodes, 50);
        const rect = { x: 50, y: 0, w: 50, h: 50 };

        expect(index.findCandidates(rect).map((node) => node.id)).toEqual(['hit']);
        expect(index.findCandidates(rect).length).toBeLessThan(nodes.length);
        expect(getCollidingNodeIds('active', rect, nodes, false, index)).toEqual(['hit']);
        expect(checkCollision('active', rect.x, rect.y, rect.w, rect.h, nodes, false, index)).toBe(
            true,
        );
    });

    it('uses a rebuilt index when layout positions change', () => {
        const nodes = createLayout(300);
        let index = createCollisionIndex(nodes, 50);

        expect(checkCollision('a', 100, 0, 100, 100, nodes, false, index)).toBe(false);

        nodes[1].grid = { x: 100, y: 0, w: 100, h: 100 };
        index = createCollisionIndex(nodes, 50);

        expect(getCollidingNodeIds('a', { x: 100, y: 0, w: 100, h: 100 }, nodes, false, index)).toEqual([
            'b',
        ]);
    });
});
