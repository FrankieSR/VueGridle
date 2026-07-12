---
outline: deep
---

# Performance Benchmark Example

Use this page as a manual smoke test for larger dashboard layouts. It renders real `GridItem`
components and runs a local spatial bucket collision scan against the same layout.

<div class="demo-container">
    <Example08PerformanceBenchmark />
</div>

## What To Check

- Switch between `100`, `250`, and `500` items.
- Drag the `Active` item toward `Hit` and confirm the UI stays responsive.
- Run the collision scan and compare `Candidates` with the total item count.
- Use browser performance tools for real product benchmarks, especially when widget content is heavy.

## Example Pattern

```vue
<template>
    <Grid :gridCellSize="50" :layout="layout">
        <GridItem
            v-for="item in layout"
            :key="item.id"
            :nodeId="item.id"
            v-model="item.grid"
            :draggable="true"
            :resizable="false"
            @collision-detected="onCollisionDetected"
        >
            <div class="benchmark-item">{{ item.label }}</div>
        </GridItem>
    </Grid>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { Grid, GridItem, type GridNode } from 'vuegridle';
    import 'vuegridle/style.css';

    type BenchmarkItem = GridNode & {
        label: string;
    };

    const layout = ref<BenchmarkItem[]>(
        Array.from({ length: 500 }, (_, index) => ({
            id: `item-${index}`,
            label: `${index + 1}`,
            grid: {
                x: (index % 20) * 50,
                y: Math.floor(index / 20) * 50,
                w: 50,
                h: 50,
            },
        })),
    );

    const onCollisionDetected = (ids: string[]) => {
        console.log('Colliding ids:', ids);
    };
</script>
```

## Notes

- `Grid :layout` lets VueGridle build a collision context once for the current layout state.
- Collision checks use spatial buckets, so drag and resize only inspect nearby candidates.
- For `100-500` lightweight items, virtualization is usually unnecessary.
- For `1000+` heavy widgets, consider virtualization as a separate application-level concern.

## Source

- [View on GitHub](https://github.com/FrankieSR/VueGridle/blob/main/docs/.vitepress/components/Example08PerformanceBenchmark.vue)
