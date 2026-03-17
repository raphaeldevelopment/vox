import { describe, it, expect, beforeEach } from "vitest";
import { State } from "../../src/state/State.js";

class FakeStorage {
    constructor() {
        this.store = {};
    }

    getItem(key) {
        return this.store[key] ?? null;
    }

    setItem(key, value) {
        this.store[key] = value;
    }

    clear() {
        this.store = {};
    }
}

describe("State", () => {
    let storage;
    let state;

    beforeEach(() => {
        State.__resetForTests();
        storage = new FakeStorage();
        state = State.getInstance();
        state.setStorage(storage);
    });

    it("creates a state bucket and reports it through has()", () => {
        state.create("user");

        expect(state.has("user")).toBe(true);
        expect(state.has("missing")).toBe(false);
    });

    it("adds a reactive variable to a state bucket", () => {
        state.addVariable( "Ana", "user", "name");

        expect(state.has("user")).toBe(true);
        expect(state.has("user", "name")).toBe(true);
    });
});