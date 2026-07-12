export function addGlobalListeners(
    onPointerMove: (event: PointerEvent) => void,
    onPointerUp: () => void,
) {
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
}

export function removeGlobalListeners(
    onPointerMove: (event: PointerEvent) => void,
    onPointerUp: () => void,
) {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);
}
