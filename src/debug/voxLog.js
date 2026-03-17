export const voxLog = (...args) => {
    if (typeof window !== "undefined" && window.__VOX_DEBUG__ === false) {
        return;
    }

    console.log("[VOX]", ...args);
};