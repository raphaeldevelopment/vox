import { createVariable } from "../variables/createVariable.js";
import { createEffect } from "../effects/createEffect.js";
import { EffectsStack } from "../utils/EffectsStack.js";

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

export class State {
    static #instance = null;

    #root = new Map();
    #storage = typeof localStorage !== "undefined" ? localStorage : new FakeStorage();
    #effectsStack = null;

    constructor() {
        if (State.#instance) return State.#instance;

        this.#effectsStack = EffectsStack.getInstance();
        this.load();

        State.#instance = this;
    }

    setStorage(storage) {
        this.#storage = storage;
    }

    create(key) {
        if (!this.#root.has(key)) {
            this.#root.set(key, new Map());
        }
    }

    get(key = null, stateKey = null) {
        if (!key) {
            return this.#root;
        }
        if (!stateKey) {
            return this.#root.get(key);
        }
        return this.#root.get(key)[stateKey];
    }

    addVariable(key, varKey, value) {
        if (!this.#root.has(key)) {
            this.#root.set(key, new Map());
        }

        const state = this.#root.get(key);

        const [variableValue, variableSetter] = createVariable(value);
        const save = this.save.bind(this);

        Object.defineProperty(state, varKey, {
            enumerable: true,
            configurable: true,
            get() {
                return variableValue;
            },
            set(newValue) {
                variableSetter(newValue);
            }
        });

        state.set(varKey, {
            get value() {
                return variableValue;
            },
            set value(newValue) {
                variableSetter(newValue);
            }
        });

        this.#effectsStack.addEffect(save);

        const cleanup = createEffect(() => {
            if (!state.has(varKey)) {
                cleanup();
                return;
            }

            this.#effectsStack.addEffect(save);
        }, [variableValue]);
    }

    addObject(key, obj) {
        if (!this.#root.has(key)) {
            this.#root.set(key, new Map());
        }

        Object.keys(obj).forEach(objKey => {
            this.addVariable(key, objKey, obj[objKey]);
        });
    }

    save() {
        const savedStorage = {};

        for (const [key, state] of this.#root.entries()) {
            savedStorage[key] = {};

            for (const [stateKey, variable] of state.entries()) {
                savedStorage[key][stateKey] = variable.value.getValue();
            }
        }

        this.#storage.setItem("voxState", JSON.stringify(savedStorage));
    }

    load() {
        const stateString = this.#storage.getItem("voxState");
        if (!stateString) return;

        const object = JSON.parse(stateString);

        Object.keys(object).forEach(key => {
            this.addObject(key, object[key]);
        });
    }

    has(key, stateKey = null) {
        if (!this.#root.has(key)) {
            return false;
        }

        if (stateKey === null) {
            return true;
        }

        return this.#root.get(key).has(stateKey);
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
}