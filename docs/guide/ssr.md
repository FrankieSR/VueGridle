---
outline: deep
---

# SSR and Nuxt

VueGridle is a Vue component library. Initial markup can be rendered on the server, while drag, resize, keyboard, and measurement behavior run in the browser after mount.

## Vite / Vue Apps

```ts
import { Grid, GridItem } from 'vuegridle';
import 'vuegridle/style.css';
```

## Nuxt

Register the CSS globally:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
    css: ['vuegridle/style.css'],
});
```

Import components where you need them:

```vue
<script setup lang="ts">
    import { Grid, GridItem } from 'vuegridle';
</script>
```

## Best Practices

- Keep initial `layout` deterministic between server and client.
- Avoid generating random widget IDs during render.
- Load saved layouts before rendering the dashboard when possible.
- If layout data is client-only, render the grid after that data is available.

## Status

Browser-only APIs are used for interaction and measurement. Full SSR hardening is planned, so test your Nuxt integration before relying on server rendering for critical dashboard screens.
