import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, type PropType } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Grid from '@/components/Grid.vue';
import GridItem from '@/components/GridItem.vue';
import { clearCollisionCache } from '@/utils/gridUtils';
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
                                resizable: false,
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
});
