import { VariableContext, CONTEXT_MAIN } from "../dom/VariableContext.js";
/**
 * Registration of all Callbacks that affect DOM elements
 */
export class CallbackRegistry {
    static #instance = null;
    #callbacks = null;
    #variableContext = null;

    constructor() {
        if (CallbackRegistry.#instance) {
            return CallbackRegistry.#instance;
        }
        /**
         * @private
         * @type {Map<string, Callback>}
         */
        this.#callbacks = new Map();
        this.#variableContext = VariableContext.getInstance();

        CallbackRegistry.#instance = this;
    }

    /**
     * Add a new Callback to the registry
     * @param {string} name
     * @param {Callback} value
     * @returns {void}
     */
    set(name, value, context = CONTEXT_MAIN) {
        if (!this.#callbacks.has(context)) {
            this.#callbacks.set(context, new Map());
        }
        this.#callbacks.get(context).set(name, value);
    }

    /**
     * Return a Callback by name
     * @param {string} name
     * @returns {Callback}
     */
    get(name, node) {
        const contexts = this.#variableContext.getContext(node);
        const context = contexts.find(cont => this.#callbacks.has(cont) && this.#callbacks.get(cont).has(name));

        if (context === undefined) {
            return null;
        }

        return this.#callbacks.get(context).get(name);
    }

    getStrict(name, context = CONTEXT_MAIN) {
        if (!this.hasStrict(name, context)) {
            return null;
        }

        return this.#callbacks.get(context).get(name);
    }

    /**
     * Check if Callback exists
     * @param {string} name
     * @returns {boolean}
     */
    has(name, node) {
        const contexts = this.#variableContext.getContext(node);
        return contexts.some(cont => this.#callbacks.has(cont) && this.#callbacks.get(cont).has(name));
    }

    hasStrict(name, context = CONTEXT_MAIN) {
        return this.#callbacks.has(context) && this.#callbacks.get(context).has(name);
    }

    /**
     * Delete a Callback
     * @param {string} name
     * @returns {boolean}
     */
    delete(name, context = CONTEXT_MAIN) {
        if (!this.#callbacks.has(context) || !this.#callbacks.get(context).has(name)) {
            return null;
        }
        return this.#callbacks.get(context).delete(name);
    }

    /**
     * Return the instance
     * @returns {CallbackRegistry}
     */
    static getInstance() {
        if (!CallbackRegistry.#instance) {
            CallbackRegistry.#instance = new CallbackRegistry();
        }
        return CallbackRegistry.#instance;
    }
}