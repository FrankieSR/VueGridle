<template>
    <div class="app-container">
        <div class="main-content">
            <Grid :gridCellSize="50" class="grid-demo">
                <GridItem
                    v-for="item in layout"
                    :key="item.id"
                    :nodeId="item.id"
                    :x="item.grid.x"
                    :y="item.grid.y"
                    :w="item.grid.w"
                    :h="item.grid.h"
                    :allNodes="layout"
                    :draggable="true"
                    :resizable="true"
                    :free-drag="item.freeDrag"
                    v-model="item.grid"
                    :minWidth="100"
                    :minHeight="100"
                    :proximity="150"
                    @drag-start="onDragStart(item.id)"
                    @drag="(x, y) => onDrag(item.id, x, y)"
                    @drag-stop="(x, y) => onDragStop(item.id, x, y)"
                    @resize-start="onResizeStart(item.id)"
                    @resize="(x, y, w, h) => onResize(item.id, x, y, w, h)"
                    @resize-stop="(x, y, w, h) => onResizeStop(item.id, x, y, w, h)"
                    @update:model-value="(value) => onUpdateModelValue(item.id, value)"
                    @item-activated="onItemActivated(item.id)"
                    @item-deactivated="onItemDeactivated(item.id)"
                    @drop="(nodeId, x, y) => onDrop(item.id, x, y)"
                    @collision-detected="
                        (collidingIds) => onCollisionDetected(item.id, collidingIds)
                    "
                >
                    <template #default="{ isNearActive }">
                        <div class="grid-item-content">
                            {{ isNearActive ? '&#128561;' : item.label }}
                        </div>
                    </template>
                </GridItem>
            </Grid>
            <div class="console-panel">
                <div class="console-header">
                    <button @click="clearLogs" class="clear-btn">Clear</button>
                </div>
                <div class="console-body">
                    <div
                        v-for="(log, index) in consoleLogs"
                        :key="index"
                        class="console-line"
                        :class="{ 'console-warning': log.type === 'warning' }"
                    >
                        {{ log.message }} {{ log.count > 1 ? `(x${log.count})` : '' }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';

    const layout = ref([
        { id: 'item-1', label: 'Item 1', grid: { x: 0, y: 0, w: 100, h: 100 } },
        { id: 'item-2', label: 'Item 2', grid: { x: 500, y: 0, w: 100, h: 100 } },
        {
            id: 'free-drag',
            label: 'Free Drag',
            freeDrag: true,
            grid: { x: 400, y: 300, w: 200, h: 100, z: 2 },
        },
    ]);

    const consoleLogs = ref<{ message: string; type: string; count: number }[]>([]);

    const addLog = (message: string, type: string = 'info') => {
        const existingLog = consoleLogs.value.find(
            (log) => log.message === message && log.type === type,
        );
        if (existingLog) {
            existingLog.count += 1;
        } else {
            consoleLogs.value.unshift({ message, type, count: 1 });
            if (consoleLogs.value.length > 20) {
                consoleLogs.value.pop();
            }
        }
    };

    const clearLogs = () => {
        consoleLogs.value = [];
    };

    const onDragStart = (nodeId: string) => {
        addLog(`[${nodeId}] Drag started`);
    };

    const onDrag = (nodeId: string, x: number, y: number) => {
        // addLog(`[${nodeId}] Dragging to x: ${x}, y: ${y}`);
    };

    const onDragStop = (nodeId: string, x: number, y: number) => {
        addLog(`[${nodeId}] Drag stopped at x: ${x}, y: ${y}`);
    };

    const onResizeStart = (nodeId: string) => {
        addLog(`[${nodeId}] Resize started`);
    };

    const onResize = (nodeId: string, x: number, y: number, w: number, h: number) => {
        // addLog(`[${nodeId}] Resizing to x: ${x}, y: ${y}, w: ${w}, h: ${h}`);
    };

    const onResizeStop = (nodeId: string, x: number, y: number, w: number, h: number) => {
        addLog(`[${nodeId}] Resize stopped at x: ${x}, y: ${y}, w: ${w}, h: ${h}`);
    };

    const onUpdateModelValue = (
        nodeId: string,
        value: { x: number; y: number; w: number; h: number },
    ) => {
        addLog(
            `[${nodeId}] Model updated to x: ${value.x}, y: ${value.y}, w: ${value.w}, h: ${value.h}`,
        );
    };

    const onItemActivated = (nodeId: string) => {
        addLog(`[${nodeId}] Item activated`);
    };

    const onItemDeactivated = (nodeId: string) => {
        addLog(`[${nodeId}] Item deactivated`);
    };

    const onDrop = (nodeId: string, x: number, y: number) => {
        addLog(`[${nodeId}] Dropped at x: ${x}, y: ${y}`);
    };

    const onCollisionDetected = (nodeId: string, collidingIds: string[]) => {
        addLog(`[${nodeId}] Collision detected with: ${collidingIds.join(', ')}`, 'warning');
    };
</script>
