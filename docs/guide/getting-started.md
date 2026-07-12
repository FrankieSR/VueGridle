---
outline: deep
---

# Getting Started

## Requirements

- Vue 3.x
- Node.js 18+ (recommended)

## Install

```bash
npm install vuegridle
```

```bash
yarn add vuegridle
```

```bash
pnpm add vuegridle
```

## Register Components Globally

```ts
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { Grid, GridItem } from 'vuegridle';
import 'vuegridle/style.css';

const app = createApp(App);

app.component('Grid', Grid);
app.component('GridItem', GridItem);

app.mount('#app');
```

## Or Import Locally

```vue
<script setup lang="ts">
    import { Grid, GridItem } from 'vuegridle';
    import 'vuegridle/style.css';
</script>
```

## First Grid

```vue
<template>
    <Grid :gridCellSize="50" :layout="layout" class="grid">
        <GridItem
            v-for="item in layout"
            :key="item.id"
            :nodeId="item.id"
            v-model="item.grid"
            :draggable="true"
            :resizable="true"
            :ariaLabel="`${item.id} widget`"
        >
            <div class="card">{{ item.id }}</div>
        </GridItem>
    </Grid>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { Grid, GridItem, type GridNode } from 'vuegridle';
    import 'vuegridle/style.css';

    const layout = ref<GridNode[]>([
        { id: 'revenue', grid: { x: 0, y: 0, w: 200, h: 120 } },
        { id: 'orders', grid: { x: 250, y: 0, w: 200, h: 120 } },
    ]);
</script>

<style scoped>
    .grid {
        width: 100%;
        height: 500px;
    }

    .card {
        height: 100%;
        padding: 16px;
        background: var(--grid-item-bg-color);
    }
</style>
```

## Next Steps

- Learn the [controlled layout model](/guide/controlled-layout).
- Review [accessibility controls](/guide/accessibility).
- Build from the [dashboard example](/examples/dashboard).
