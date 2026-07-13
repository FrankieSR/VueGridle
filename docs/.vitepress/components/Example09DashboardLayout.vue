<template>
    <div class="dashboard-demo-shell">
        <header class="dashboard-demo-toolbar">
            <div>
                <h2>Operations Dashboard</h2>
                <span>{{ saveStatus }}</span>
            </div>
            <button class="example-button" type="button" @click="resetLayout">Reset layout</button>
        </header>

        <div ref="gridFrame" class="dashboard-demo-frame">
            <Grid :gridCellSize="20" :layout="layout" class="dashboard-demo-grid">
                <GridItem
                    v-for="item in layout"
                    :key="item.id"
                    :nodeId="item.id"
                    v-model="item.grid"
                    :draggable="true"
                    :resizable="true"
                    :minWidth="120"
                    :minHeight="100"
                    :ariaLabel="`${item.title} widget`"
                    @drag-stop="saveLayout"
                    @resize-stop="saveLayout"
                    @collision-detected="(ids) => markCollision(item.id, ids)"
                >
                    <section
                        class="dashboard-demo-card"
                        :class="{ warning: collisionId === item.id }"
                    >
                        <div>
                            <h3>{{ item.title }}</h3>
                            <strong>{{ item.value }}</strong>
                        </div>
                        <small>{{ item.caption }}</small>
                    </section>
                </GridItem>
            </Grid>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';

    type DashboardItem = {
        id: string;
        title: string;
        value: string;
        caption: string;
        grid: {
            x: number;
            y: number;
            w: number;
            h: number;
        };
    };

    const DEFAULT_WIDTH = 640;
    const MOBILE_BREAKPOINT = 520;

    const gridFrame = ref<HTMLElement | null>(null);
    const gridWidth = ref(DEFAULT_WIDTH);
    const layout = ref<DashboardItem[]>([]);
    const collisionId = ref<string | null>(null);
    const saveStatus = ref('Layout ready');
    let resizeObserver: ResizeObserver | null = null;
    let currentMode: 'desktop' | 'mobile' | null = null;

    const cloneLayout = (items: DashboardItem[]) =>
        items.map((item) => ({
            ...item,
            grid: { ...item.grid },
        }));

    const createLayout = (width: number): DashboardItem[] => {
        if (width < MOBILE_BREAKPOINT) {
            const cardWidth = Math.max(120, Math.min(240, width - 4));

            return [
                {
                    id: 'revenue',
                    title: 'Revenue',
                    value: '$128.4K',
                    caption: 'Month to date',
                    grid: { x: 0, y: 0, w: cardWidth, h: 120 },
                },
                {
                    id: 'orders',
                    title: 'Orders',
                    value: '1,284',
                    caption: 'Last 30 days',
                    grid: { x: 0, y: 140, w: cardWidth, h: 120 },
                },
                {
                    id: 'pipeline',
                    title: 'Pipeline',
                    value: '$942K',
                    caption: 'Weighted forecast',
                    grid: { x: 0, y: 280, w: cardWidth, h: 140 },
                },
            ];
        }

        return [
            {
                id: 'revenue',
                title: 'Revenue',
                value: '$128.4K',
                caption: 'Month to date',
                grid: { x: 0, y: 0, w: 280, h: 140 },
            },
            {
                id: 'orders',
                title: 'Orders',
                value: '1,284',
                caption: 'Last 30 days',
                grid: { x: 300, y: 0, w: 220, h: 140 },
            },
            {
                id: 'pipeline',
                title: 'Pipeline',
                value: '$942K',
                caption: 'Weighted forecast',
                grid: { x: 0, y: 160, w: 520, h: 180 },
            },
        ];
    };

    const syncResponsiveLayout = (force = false) => {
        if (!gridFrame.value) return;

        const gridElement = gridFrame.value.querySelector<HTMLElement>('.dashboard-demo-grid');
        gridWidth.value = gridElement?.clientWidth || gridFrame.value.clientWidth || DEFAULT_WIDTH;

        const nextMode = gridWidth.value < MOBILE_BREAKPOINT ? 'mobile' : 'desktop';
        if (!force && currentMode === nextMode) return;

        currentMode = nextMode;
        layout.value = cloneLayout(createLayout(gridWidth.value));
    };

    const saveLayout = () => {
        const payload = layout.value.map(({ id, grid }) => ({ id, grid }));

        if (typeof window !== 'undefined') {
            window.localStorage.setItem('vuegridle-dashboard-demo-layout', JSON.stringify(payload));
        }

        saveStatus.value = 'Layout saved';
    };

    const resetLayout = () => {
        syncResponsiveLayout(true);
        saveStatus.value = 'Layout reset';
    };

    const markCollision = (id: string, collidingIds: string[]) => {
        if (collidingIds.length === 0) return;

        collisionId.value = id;
        window.setTimeout(() => {
            collisionId.value = null;
        }, 800);
    };

    onMounted(() => {
        syncResponsiveLayout(true);
        resizeObserver = new ResizeObserver(() => syncResponsiveLayout());

        if (gridFrame.value) {
            resizeObserver.observe(gridFrame.value);
        }
    });

    onUnmounted(() => {
        resizeObserver?.disconnect();
    });
</script>

<style scoped>
    .dashboard-demo-shell {
        display: grid;
        gap: 16px;
    }

    .dashboard-demo-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
    }

    .dashboard-demo-toolbar h2 {
        margin: 0 0 4px;
        font-size: 1rem;
    }

    .dashboard-demo-toolbar span {
        color: var(--vp-c-text-2);
        font-size: 0.85rem;
    }

    .dashboard-demo-frame {
        width: 100%;
        max-width: 640px;
    }

    .dashboard-demo-grid {
        width: 100%;
        height: 460px;
        border: 1px solid var(--vp-c-divider);
        background-color: var(--grid-bg-color);
        background-image:
            linear-gradient(
                0deg,
                transparent calc(var(--grid-cell-size) - 2px),
                var(--grid-line-color) calc(var(--grid-cell-size) - 1px),
                var(--grid-line-color) var(--grid-cell-size),
                transparent calc(var(--grid-cell-size) + 1px)
            ),
            linear-gradient(
                90deg,
                transparent calc(var(--grid-cell-size) - 2px),
                var(--grid-line-color) calc(var(--grid-cell-size) - 1px),
                var(--grid-line-color) var(--grid-cell-size),
                transparent calc(var(--grid-cell-size) + 1px)
            );
        background-size: var(--grid-cell-size) var(--grid-cell-size);
    }

    .dashboard-demo-card {
        display: flex;
        height: 100%;
        flex-direction: column;
        justify-content: space-between;
        padding: 14px;
        background: #343a46;
        color: #f8fafc;
    }

    .dashboard-demo-card.warning {
        outline: 2px solid #f97316;
    }

    .dashboard-demo-card h3 {
        margin: 0 0 8px;
        color: inherit;
        font-size: 0.85rem;
    }

    .dashboard-demo-card strong {
        font-size: 1.3rem;
    }

    .dashboard-demo-card small {
        color: #cbd5e1;
    }

    @media only screen and (max-width: 760px) {
        .dashboard-demo-toolbar {
            align-items: flex-start;
            flex-direction: column;
        }

        .dashboard-demo-grid {
            height: 440px;
        }
    }
</style>
