import { describe, it, expect, vi } from "vitest";
import { createVariable } from "../../src/variables/createVariable.js";
import { createEffect } from "../../src/effects/createEffect.js";
import { nextFrame } from "../utils.js";

describe("createEffect", () => {
    it("subscribes the callback to a single variable", async () => {
        const [count, setCount] = createVariable(0);
        const callback = vi.fn();

        createEffect(callback, [count]);
        setCount(1);

        await nextFrame();

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(1, 0);
    });

    it("subscribes the same callback to multiple variables", async () => {
        const [a, setA] = createVariable(1);
        const [b, setB] = createVariable(2);
        const callback = vi.fn();

        createEffect(callback, [a, b]);

        setA(3);
        setB(4);

        await nextFrame();

        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback.mock.calls[0]).toEqual([3, 1]);
        expect(callback.mock.calls[1]).toEqual([4, 2]);
    });
});