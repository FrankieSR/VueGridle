<template>
    <div class="benchmark-shell">
        <div class="example-toolbar benchmark-toolbar" aria-label="Benchmark size">
            <button
                v-for="count in benchmarkSizes"
                :key="count"
                type="button"
                class="example-button"
                :class="{ active: itemCount === count }"
                @click="setItemCount(count)"
            >
                {{ count }} items
            </button>
            <button type="button" class="example-button" @click="runCollisionScan">
                Run collision scan
            </button>
        </div>

        <div class="benchmark-stats" aria-live="polite">
            <span>Rendered: {{ layout.length }} items</span>
            <span>Render update: {{ renderMs.toFixed(2) }} ms</span>
            <span>Scan: {{ scanMs.toFixed(2) }} ms</span>
            <span>Candidates: {{ candidateCount }}</span>
            <span>Collisions: {{ collisionCount }}</span>
        </div>

        <div class="benchmark-viewport">
            <Grid
                :gridCellSize="50"
                :layout="layout"
                class="benchmark-grid"
                :style="{ height: `${gridHeight}px` }"
            >
                <GridItem
                    v-for="item in layout"
                    :key="item.id"
                    :nodeId="item.id"
                    v-model="item.grid"
                    :draggable="true"
                    :resizable="false"
                    :minWidth="50"
                    :minHeight="50"
                    :ariaLabel="`${item.label} benchmark item`"
                    @collision-detected="onCollisionDetected"
                >
                    <div class="benchmark-item" :class="{ active: item.id === 'active' }">
                        {{ item.label }}
                    </div>
                </GridItem>
            </Grid>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, nextTick, ref } from 'vue';

    type BenchmarkItem = {
        id: string;
        label: string;
        grid: {
            x: number;
            y: number;
            w: number;
            h: number;
        };
    };

    const benchmarkSizes = [100, 250, 500] as const;
    const itemCount = ref<(typeof benchmarkSizes)[number]>(100);
    const renderMs = ref(0);
    const scanMs = ref(0);
    const candidateCount = ref(0);
    const collisionCount = ref(0);

    const now = () => (typeof performance === 'undefined' ? Date.now() : performance.now());

    const makeLayout = (count: number): BenchmarkItem[] => [
        { id: 'active', label: 'Active', grid: { x: 0, y: 0, w: 50, h: 50 } },
        { id: 'target', label: 'Hit', grid: { x: 50, y: 0, w: 50, h: 50 } },
        ...Array.from({ length: count - 2 }, (_, index) => {
            const columns = 20;
            const x = (index % columns) * 50;
            const y = 150 + Math.floor(index / columns) * 50;

            return {
                id: `item-${index + 1}`,
                label: `${index + 1}`,
                grid: { x, y, w: 50, h: 50 },
            };
        }),
    ];

    const layout = ref<BenchmarkItem[]>(makeLayout(itemCount.value));
    const gridHeight = computed(() => {
        const rows = Math.ceil(Math.max(0, itemCount.value - 2) / 20);
        return Math.max(560, 150 + rows * 50);
    });

    const isCollision = (a: BenchmarkItem['grid'], b: BenchmarkItem['grid']) =>
        a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

    const getBucketKey = (x: number, y: number) => `${x}:${y}`;

    const getBucketRange = (rect: BenchmarkItem['grid'], bucketSize: number) => ({
        minX: Math.floor(rect.x / bucketSize),
        minY: Math.floor(rect.y / bucketSize),
        maxX: Math.floor((rect.x + Math.max(0, rect.w - 1)) / bucketSize),
        maxY: Math.floor((rect.y + Math.max(0, rect.h - 1)) / bucketSize),
    });

    const runCollisionScan = () => {
        const startedAt = now();
        const bucketSize = 50;
        const buckets = new Map<string, BenchmarkItem[]>();

        for (const item of layout.value) {
            const range = getBucketRange(item.grid, bucketSize);

            for (let x = range.minX; x <= range.maxX; x += 1) {
                for (let y = range.minY; y <= range.maxY; y += 1) {
                    const key = getBucketKey(x, y);
                    const bucket = buckets.get(key);

                    if (bucket) {
                        bucket.push(item);
                    } else {
                        buckets.set(key, [item]);
                    }
                }
            }
        }

        const activeRect = { x: 50, y: 0, w: 50, h: 50 };
        const range = getBucketRange(activeRect, bucketSize);
        const candidates = new Set<BenchmarkItem>();

        for (let x = range.minX; x <= range.maxX; x += 1) {
            for (let y = range.minY; y <= range.maxY; y += 1) {
                buckets.get(getBucketKey(x, y))?.forEach((item) => candidates.add(item));
            }
        }

        const collisions = Array.from(candidates).filter(
            (item) => item.id !== 'active' && isCollision(activeRect, item.grid),
        );

        candidateCount.value = candidates.size;
        collisionCount.value = collisions.length;
        scanMs.value = now() - startedAt;
    };

    const setItemCount = async (count: (typeof benchmarkSizes)[number]) => {
        const startedAt = now();
        itemCount.value = count;
        layout.value = makeLayout(count);
        await nextTick();
        renderMs.value = now() - startedAt;
        runCollisionScan();
    };

    const onCollisionDetected = (ids: string[]) => {
        collisionCount.value = ids.length;
    };

    runCollisionScan();
</script>

<style scoped>
    .benchmark-shell {
        display: grid;
        gap: 16px;
    }

    .benchmark-toolbar .example-button.active {
        border-color: var(--vp-c-brand-1);
        background: var(--vp-c-brand-soft);
    }

    .benchmark-stats {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 8px;
    }

    .benchmark-stats span {
        min-width: 0;
        padding: 8px 10px;
        border: 1px solid var(--vp-c-divider);
        border-radius: 6px;
        color: var(--vp-c-text-1);
        background: var(--vp-c-bg-soft);
        font-size: 0.85rem;
        font-weight: 600;
    }

    .benchmark-viewport {
        width: 100%;
        max-height: 620px;
        overflow: auto;
        border: 1px solid var(--vp-c-divider);
        border-radius: 8px;
        background: var(--vp-c-bg-soft);
    }

    .benchmark-grid {
        width: 1000px;
        min-width: 1000px;
        border: 0;
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

    .benchmark-item {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #343a46;
        color: #f8fafc;
        font-size: 0.75rem;
        font-weight: 700;
    }

    .benchmark-item.active {
        background: #4a3340;
    }

    @media only screen and (max-width: 760px) {
        .benchmark-stats {
            grid-template-columns: 1fr;
        }
    }
</style>
