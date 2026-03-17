import { describe, it, expect, beforeEach } from "vitest";
import { EffectsStack } from "../../src/effects/EffectsStack.js";

describe("EffectsStack", () => {
    beforeEach(() => {
        const stack = EffectsStack.getInstance();
        stack.requestAnimationFrameID = 0;
    });

    it("ignores non-function values", async () => {
        const stack = EffectsStack.getInstance();

        stack.addEffect(null);
        stack.addEffect(undefined);
        stack.addEffect(123);

        await new Promise(resolve => setTimeout(resolve, 10));

        expect(stack.requestAnimationFrameID).toBe(0);
    });

    it("runs an added effect on the next frame", async () => {
        const stack = EffectsStack.getInstance();
        let runs = 0;

        stack.addEffect(() => {
            runs++;
        });

        await new Promise(resolve => setTimeout(resolve, 10));

        expect(runs).toBe(1);
    });

    it("deduplicates the same effect in one frame", async () => {
        const stack = EffectsStack.getInstance();
        let runs = 0;

        const effect = () => {
            runs++;
        };

        stack.addEffect(effect);
        stack.addEffect(effect);
        stack.addEffect(effect);

        await new Promise(resolve => setTimeout(resolve, 10));

        expect(runs).toBe(1);
    });

    it("schedules another frame when new effects are added during flush", async () => {
        const stack = EffectsStack.getInstance();
        let runs = 0;

        const second = () => {
            runs++;
        };

        const first = () => {
            runs++;
            stack.addEffect(second);
        };

        stack.addEffect(first);

        await new Promise(resolve => setTimeout(resolve, 20));

        expect(runs).toBe(2);
    });
});