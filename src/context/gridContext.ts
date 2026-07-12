import { type InjectionKey } from 'vue';
import { type GridContext } from '@/types/gridTypes';

export const gridContextKey: InjectionKey<GridContext> = Symbol('VueGridleGridContext');
