export function addGlobalListeners(
    onMouseMove: (event: MouseEvent | TouchEvent) => void,
    onMouseUp: () => void,
) {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchend', onMouseUp);
}

export function removeGlobalListeners(
    onMouseMove: (event: MouseEvent | TouchEvent) => void,
    onMouseUp: () => void,
) {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('touchmove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    window.removeEventListener('touchend', onMouseUp);
}
