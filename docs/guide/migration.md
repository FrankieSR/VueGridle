---
outline: deep
---

# Migration Notes

This page tracks API changes that matter when upgrading VueGridle.

## Prefer `Grid :layout`

`Grid :layout` is now the recommended collision context API.

```vue
<Grid :layout="layout">
    <GridItem
        v-for="item in layout"
        :key="item.id"
        :nodeId="item.id"
        v-model="item.grid"
    />
</Grid>
```

## `GridItem :allNodes` Is Deprecated

Old code may still work:

```vue
<GridItem :allNodes="layout" />
```

New code should avoid this because it repeats the same layout for every item and makes larger dashboards harder to maintain.

## CSS Import

Use the explicit CSS subpath:

```ts
import 'vuegridle/style.css';
```

## Public Exports

The stable public API is:

```ts
import { Grid, GridItem } from 'vuegridle';
import type { GridNode, Rect } from 'vuegridle';
```

Internal composables are not part of the documented public API.
