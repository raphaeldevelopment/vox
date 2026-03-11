export function voxLog(...args) {
    if (!__VOX_DEBUG__) return;
    console.log("[VOX]", ...args);
}