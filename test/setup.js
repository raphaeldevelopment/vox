import { vi } from "vitest";

vi.stubGlobal("requestAnimationFrame", callback => {
    return setTimeout(() => callback(Date.now()), 0);
});

vi.stubGlobal("cancelAnimationFrame", id => {
    clearTimeout(id);
});