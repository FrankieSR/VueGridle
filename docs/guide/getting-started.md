## Installation ⚡

### Prerequisites
- Vue 3.x
- Node.js 18+ (recommended)

### Via npm
```bash
npm install vuegridle
```

### Via Yarn
```bash
yarn add vuegridle
```

---

## Quick Start

Add `VueGridle` to your Vue 3 app:

```ts
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { Grid, GridItem } from 'vuegridle';

const app = createApp(App);
app.component('Grid', Grid);
app.component('GridItem', GridItem);

app.mount('#app');
```

Now you can use `<Grid>` and `<GridItem>` in your templates.

---