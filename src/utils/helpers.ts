export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

export function getClientCoordinates(event: PointerEvent): {
    clientX: number;
    clientY: number;
} {
    return { clientX: event.clientX, clientY: event.clientY };
}
