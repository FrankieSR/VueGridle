export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

export function getClientCoordinates(event: MouseEvent | TouchEvent): {
    clientX: number;
    clientY: number;
} {
    if ('touches' in event && event.touches.length > 0) {
        return { clientX: event.touches[0].clientX, clientY: event.touches[0].clientY };
    } else if ('changedTouches' in event && event.changedTouches.length > 0) {
        return {
            clientX: event.changedTouches[0].clientX,
            clientY: event.changedTouches[0].clientY,
        };
    } else {
        return {
            clientX: (event as MouseEvent).clientX,
            clientY: (event as MouseEvent).clientY,
        };
    }
}
