declare global {
  interface Window {
    __VOX_DEBUG__: boolean;
  }
}

export const voxLog = (...args: Array<any>) => {
    if (typeof window !== "undefined" && window.__VOX_DEBUG__ === false) {
        return;
    }

    console.log("[VOX]", ...args);
};