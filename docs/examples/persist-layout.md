---
outline: deep
---

# Persist Layout Example

This example saves the layout after final drag and resize events. In a real app, replace `localStorage` with your API.

<div class="demo-container">
    <Example07PersistLayout />
</div>

## Usage

```vue
<Grid :gridCellSize="50" :layout="layout">
    <GridItem
        v-for="item in layout"
        :key="item.id"
        :nodeId="item.id"
        v-model="item.grid"
        @drag-stop="saveLayout"
        @resize-stop="saveLayout"
    />
</Grid>
```

```ts
const saveLayout = async () => {
    await api.saveLayout(
        layout.value.map(({ id, grid }) => ({
            id,
            grid,
        })),
    );
};
```

## Best Practice

Persist on `drag-stop` and `resize-stop`. Avoid saving every `drag` or `resize` frame unless you debounce heavily.
