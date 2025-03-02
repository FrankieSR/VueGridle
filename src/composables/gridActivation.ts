import { inject, onMounted, onUnmounted } from 'vue';

export function useGridActivation(props: any, emit: any, item: any) {
    const gridContext = inject('gridContext') as any;

    const setActiveItem = () => {
        gridContext.setActiveItem({
            onMouseMove: null, // Будет передаваться из других модулей при необходимости
            onMouseUp: null,
            id: props.nodeId,
            rect: { x: props.x, y: props.y, w: props.w, h: props.h },
        });
    };

    const activateItem = () => {
        if (!props.draggable && !props.resizable) {
            setActiveItem();
            emit('itemActivated', props.nodeId);
        }
    };

    const handleOutsideClick = (event: MouseEvent) => {
        // Проверяем, что item существует и инициализирован
        if (!item || !item.value || item.value.contains(event.target as Node)) return;
        if (gridContext.activeItemId.value === props.nodeId) {
            gridContext.clearActiveItem();
            emit('itemDeactivated', props.nodeId);
        }
    };

    // Добавляем слушатель только после монтирования
    onMounted(() => {
        document.addEventListener('click', handleOutsideClick);
    });

    // Удаляем слушатель при размонтировании
    onUnmounted(() => {
        document.removeEventListener('click', handleOutsideClick);
    });

    return {
        activateItem,
    };
}
