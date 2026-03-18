import { createVariable } from "../variables/createVariable.js";
import { createEffect } from "../effects/createEffect.js";
import { EffectsStack } from "../effects/EffectsStack.js";

class FakeStorage {
    constructor() {
        this.store = {};
    }

    getItem(key) {
        return this.store[key] ?? null;
    }

    setItem(key, value) {
        this.store[key] = String(value);
    }

    clear() {
        this.store = {};
    }

    removeItem(key) {
        delete this.store[key];
    }
}

class StateLeaf {
    #variable;
    #setValue;

    constructor(variable, setValue) {
        this.#variable = variable;
        this.#setValue = setValue;
    }

    get value() {
        return this.#variable;
    }

    set value(nextValue) {
        this.#setValue(nextValue);
    }

    setValue(nextValue) {
        this.#setValue(nextValue);
    }
}

class StateNode {
    #children = new Map();

    set(name, child) {
        return this.#children.set(name, child);
    }

    get(name) {
        return this.#children.get(name) ?? null;
    }

    has(name) {
        return this.#children.has(name);
    }

    delete(name) {
        return this.#children.delete(name);
    }

    entries() {
        return this.#children.entries();
    }

    keys() {
        return this.#children.keys();
    }

    values() {
        return this.#children.values();
    }

    toObject() {
        const output = {};

        for (const [key, child] of this.#children.entries()) {
            if (child instanceof StateNode) {
                output[key] = child.toObject();
            } else {
                output[key] = child.value.getValue();
            }
        }

        return output;
    }
}

export class State {
    static #instance = null;

    #root;
    #storage;
    #effectsStack;
    #cleanups;

    constructor() {
        if (State.#instance) {
            return State.#instance;
        }

        this.#root = new StateNode();
        this.#storage =
            typeof localStorage !== "undefined" ? localStorage : new FakeStorage();
        this.#effectsStack = EffectsStack.getInstance();
        this.#cleanups = new Map();

        State.#instance = this;

        this.load();
    }

    static getInstance() {
        if (!State.#instance) {
            State.#instance = new State();
        }

        return State.#instance;
    }

    static __resetForTests() {
        State.#instance = null;
    }

    setStorage(storage) {
        this.#storage = storage ?? new FakeStorage();
    }

    create(...keys) {
        let root = this.#root;
        for (const key of keys) {
            const current = root.get(key);

            if (current === null) {
                const node = new StateNode();
                root.set(key, node);
                root = node;
                continue;
            }

            if (!(current instanceof StateNode)) {
                throw new Error(`Cannot create nested state under leaf "${key}"`);
            }

            root = current;
        }

        return root;
    }

    get(...keys) {
        if (keys.length === 0) {
            return this.#root;
        }

        let state = this.#root;

        for (const key of keys) {
            if (!(state instanceof StateNode)) {
                return null;
            }

            state = state.get(key);

            if (!state) {
                return null;
            }
        }

        return state;
    }

    has(...keys) {
        return !!this.get(...keys);
    }

    addVariable(initialValue, ...keys) {
        const pathKeys = keys.slice(0, -1);      
        const varKey = keys.at(-1);
        const state = this.create(...pathKeys);

        if (state.has(varKey)) {
            const existingLeaf = state.get(varKey);
            existingLeaf.value = initialValue;
            return existingLeaf;
        }

        const [variableValue, variableSetter] = createVariable(initialValue);
        const leaf = new StateLeaf(variableValue, variableSetter);

        state.set(varKey, leaf);

        const save = () => {
            this.#effectsStack.addEffect(() => this.save());
        };

        save();
        const cleanupKey = keys.join(".");
        const cleanup = createEffect(() => {
            if (!state.has(varKey)) {
                cleanup();
                
                
                this.#cleanups.delete(cleanupKey);
                return;
            }

            save();
        }, [variableValue]);

        this.#cleanups.set(cleanupKey, cleanup);

        return leaf;
    }

    addObject(obj, ...keys) {
        Object.entries(obj).forEach(([objKey, value]) => {
            if (value && typeof value === "object" && !Array.isArray(value)) {
                this.addObject(value, ...keys, objKey);
            } else {
                this.addVariable(value, ...keys, objKey);
            }
        });
    }

    removeVariable(...keys) {
        const pathKeys = keys.slice(0, -1);   
        const varKey = keys.at(-1);

        const state = this.get(...pathKeys);

        if (!state || !state.has(varKey)) {
            return false;
        }

        const cleanupKey = keys.join(".");
        const cleanup = this.#cleanups.get(cleanupKey);

        if (cleanup) {
            cleanup();
            this.#cleanups.delete(cleanupKey);
        }

        state.delete(varKey);

        this.save();
        return true;
    }

    getValuesForSave(root = this.#root) {
        return root.toObject();
    }

    save() {
        const savedStorage = this.getValuesForSave();
        this.#storage.setItem("voxState", JSON.stringify(savedStorage));
    }

    load() {
        const stateString = this.#storage.getItem("voxState");

        if (!stateString) {
            return;
        }

        try {
            const object = JSON.parse(stateString);

            Object.entries(object).forEach(([key, value]) => {
                if (value && typeof value === "object" && !Array.isArray(value)) {
                    this.addObject(value, key);
                } else {
                    this.addVariable(value, key, "value");
                }
            });
        } catch (error) {
            console.warn("Failed to load persisted Vox state:", error);
        }
    }

    clear() {
        for (const cleanup of this.#cleanups.values()) {
            cleanup();
        }

        this.#cleanups.clear();
        this.#root = new StateNode();
        this.#storage.removeItem?.("voxState");
    }
}