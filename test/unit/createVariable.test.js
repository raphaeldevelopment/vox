import { describe, it, expect } from "vitest";
import { createVariable } from "../../src/core/variables/createVariable.js";
import { nextFrame } from "../utils.js";


describe("createVariable", () => {
    it("returns the initial value through Variable.getValue()", () => {
        const [value] = createVariable(10);

        expect(value.getValue()).toBe(10);
    });

    it("updates the value through the setter callback", () => {
        const [value, setValue] = createVariable(10);

        setValue(25);

        expect(value.getValue()).toBe(25);
    });

    it("does not fire events when the new value is strictly equal", () => {
        const [value, setValue] = createVariable("vox");
        let runs = 0;

        value.getAddEvent()(() => {
            runs++;
        });

        setValue("vox");

        expect(runs).toBe(0);
    });

    it("fires subscribed events with new and old value", async () => {
        const [value, setValue] = createVariable(1);
        const calls = [];

        value.getAddEvent()((newValue, oldValue) => {
            calls.push([newValue, oldValue]);
        });

        setValue(2);

        await nextFrame();

        expect(calls).toEqual([[2, 1]]);
    });
});