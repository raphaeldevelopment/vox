import { createVariable } from "../variables/createVariable";
import { createEffect } from "../effects/createEffect";
import { EffectsStack } from "../effects/EffectsStack";
import { Variable } from "../variables/Variable";

class FakeStorage {
    store: Record<string, string>
    constructor() {
        this.store = {};
    }

    getItem(key: string) {
        return this.store[key] ?? null;
    }

    setItem(key: string, value: string) {
        this.store[key] = String(value);
    }

    clear() {
        this.store = {};
    }

    removeItem(key: string) {
        delete this.store[key];
    }
}

class StateLeaf<T> {
    #variable;
    #setValue;

    constructor(variable: Variable<any>, setValue: Function) {
        this.#variable = variable;
        this.#setValue = setValue;
    }

    get value() {
        return this.#variable;
    }

    set value(nextValue) {
        this.#setValue(nextValue);
    }

    setValue(nextValue: T) {
        this.#setValue(nextValue);
    }
}

class StateNode {
    #children: Map<string, StateNode | StateLeaf<any>> = new Map();

    set(name: string, child: StateNode | StateLeaf<any>) {
        return this.#children.set(name, child);
    }

    get(name: string): StateNode | StateLeaf<any> | null {
        return this.#children.get(name) ?? null;
    }

    has(name: string): boolean {
        return this.#children.has(name);
    }

    delete(name: string): boolean {
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

    toObject(): Record<string, unknown> {
        const output: Record<string, unknown> = {};

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
    static #instance: State | null = null;

    #root: StateNode | undefined;
    #storage: Storage | FakeStorage | undefined;
    #effectsStack: EffectsStack | undefined;
    #cleanups: Map<string, Function> | undefined;

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

    static getInstance(): State {
        if (!State.#instance) {
            State.#instance = new State();
        }

        return State.#instance;
    }

    static __resetForTests() {
        State.#instance = null;
    }

    setStorage(storage: Storage) {
        this.#storage = storage ?? new FakeStorage();
    }

    create(...keys: Array<any>) {
        if (!this.#root) {
            return;
        }
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

    get(...keys: Array<string>): StateNode | StateLeaf<any> | null {
        if (!this.#root) {
            return null;
        }
        if (keys.length === 0) {
            return this.#root;
        }

        let state: StateNode | StateLeaf<any> | null = this.#root;

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

    has(...keys: Array<string>) {
        return !!this.get(...keys);
    }

    addVariable(initialValue: any, ...keys: Array<string>) {
        const pathKeys = keys.slice(0, -1);      
        const varKey = keys.at(-1);
        const state = this.create(...pathKeys);
        if (!state) {
            return;
        }

        if (state.has(varKey as string)) {
            const existingLeaf = state.get(varKey as string) as StateLeaf<any>;
            if (!existingLeaf?.value) {
                return;
            }
            existingLeaf.value = initialValue;
            return;
        }

        const [variableValue, variableSetter] = createVariable(initialValue);
        const leaf = new StateLeaf(variableValue, variableSetter);

        state.set(varKey as string, leaf);

        const save = () => {
            if (!this.#effectsStack) {
                return;
            }
            this.#effectsStack.addEffect(() => this.save());
        };

        save();
        const cleanupKey = keys.join(".");
        const cleanup = createEffect(() => {
            if (!state.has(varKey as string)) {
                cleanup();
                
                
                this.#cleanups?.delete(cleanupKey);
                return;
            }

            save();
        }, [variableValue]);

        this.#cleanups?.set(cleanupKey, cleanup);

        return leaf;
    }

    addObject(obj: Record<string, unknown>, ...keys: Array<string>) {
        Object.entries(obj).forEach(([objKey, value]) => {
            if (value && typeof value === "object" && !Array.isArray(value)) {
                this.addObject(value as Record<string, unknown>, ...keys, objKey);
            } else {
                this.addVariable(value, ...keys, objKey);
            }
        });
    }

    removeVariable(...keys: Array<string>): boolean {
        const pathKeys = keys.slice(0, -1);   
        const varKey = keys.at(-1);

        const state = this.get(...pathKeys) as StateNode;

        if (!state || !state.has(varKey as string)) {
            return false;
        }

        const cleanupKey = keys.join(".");
        const cleanup = this.#cleanups?.get(cleanupKey);

        if (cleanup) {
            cleanup();
            this.#cleanups?.delete(cleanupKey);
        }

        state.delete(varKey as string);

        this.save();
        return true;
    }

    getValuesForSave(root = this.#root): Record<string, unknown> {
        return root?.toObject() || {};
    }

    save() {
        const savedStorage = this.getValuesForSave();
        this.#storage?.setItem("voxState", JSON.stringify(savedStorage));
    }

    load() {
        const stateString = this.#storage?.getItem("voxState");

        if (!stateString) {
            return;
        }

        try {
            const object = JSON.parse(stateString);

            Object.entries(object).forEach(([key, value]) => {
                if (value && typeof value === "object" && !Array.isArray(value)) {
                    this.addObject(value as Record<string, any>, key);
                } else {
                    this.addVariable(value, key, "value");
                }
            });
        } catch (error) {
            console.warn("Failed to load persisted Vox state:", error);
        }
    }

    clear() {
        if (!this.#cleanups) {
            return;
        }
        for (const cleanup of this.#cleanups.values()) {
            cleanup();
        }

        this.#cleanups?.clear();
        this.#root = new StateNode();
        this.#storage?.removeItem?.("voxState");
    }
}