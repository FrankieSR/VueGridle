import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import { Grid, GridItem } from '../../../dist/vuegridle.es';
import SimpleGrid from '../components/SimpleGrid.vue';
import Example01Basic from '../components/Example01Basic.vue';
import Example02DraggableResizeble from '../components/Example02DraggableResizeble.vue';
import Example03AddRemove from '../components/Example03AddRemove.vue';
import Example04DragOutside from '../components/Example04DragOutside.vue';
import Example05CollisionHandling from '../components/Example05CollisionHandling.vue';

import '../../../dist/vuegridle.css';
import './custom.css';

const theme: Theme = {
    ...DefaultTheme,
    enhanceApp({ app }) {
        app.component('Grid', Grid);
        app.component('GridItem', GridItem);
        app.component('Example01Basic', Example01Basic);
        app.component('Example02DraggableResizeble', Example02DraggableResizeble);
        app.component('Example03AddRemove', Example03AddRemove);
        app.component('Example04DragOutside', Example04DragOutside);
        app.component('Example05CollisionHandling', Example05CollisionHandling);
        app.component('SimpleGrid', SimpleGrid);
        
    },
};

export default theme;
