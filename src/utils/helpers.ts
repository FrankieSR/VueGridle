export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

export function getClientCoordinates(event: MouseEvent | TouchEvent): {
    clientX: number;
    clientY: number;
} {
    const touch = 'touches' in event ? (event.touches[0] ?? event.changedTouches[0]) : null;
    return touch
        ? { clientX: touch.clientX, clientY: touch.clientY }
        : { clientX: (event as MouseEvent).clientX, clientY: (event as MouseEvent).clientY };
}
