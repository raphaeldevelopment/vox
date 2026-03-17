import { VariableContext, CONTEXT_MAIN } from "../dom/VariableContext.js";

/**
 * Registration of all variables that affect DOM elements
 */
export class VariableRegistry {
    static #instance = null;
    #variables = null;
    #variableContext = null;

    constructor() {
        if (VariableRegistry.#instance) {
            return VariableRegistry.#instance;
        }
        
        this.#variableContext = VariableContext.getInstance();
        this.#variables = new Map();

        VariableRegistry.#instance = this;
    }

    set(name, value, context = CONTEXT_MAIN) {
        if (!this.#variables.has(context)) {
            this.#variables.set(context, new Map());
        }
        this.#variables.get(context).set(name, value);
    }

    get(name, node) {
        const contexts = this.#variableContext.getContext(node);
        const context = contexts.find(cont => this.#variables.has(cont) && this.#variables.get(cont).has(name));

        if (context === undefined) {
            return null;
        }

        return this.#variables.get(context).get(name);
    }

    getContextName(name, node) {
        const contexts = this.#variableContext.getContext(node);
        const context = contexts.find(cont => this.#variables.has(cont) && this.#variables.get(cont).has(name));

        if (context === undefined) {
            return null;
        }

        return context;
    }

    has(name, node) {
        const contexts = this.#variableContext.getContext(node);
        return contexts.some(cont => this.#variables.has(cont) && this.#variables.get(cont).has(name));
    }

    delete(name, context = CONTEXT_MAIN) {
        if (!this.#variables.has(context) || !this.#variables.get(context).has(name)) {
            return null;
        }
        return this.#variables.get(context).delete(name);
    }

    static getInstance() {
        if (!VariableRegistry.#instance) {
            VariableRegistry.#instance = new VariableRegistry();
        }
        return VariableRegistry.#instance;
    }
}

export default VariableRegistry;