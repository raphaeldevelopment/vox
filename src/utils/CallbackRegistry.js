/**
 * Registration of all Callbacks that affect DOM elements
 */
export class CallbackRegistry {
    static #instance = null;

    constructor() {
        if (CallbackRegistry.#instance) {
            return CallbackRegistry.#instance;
        }

        /**
         * @private
         * @type {Map<string, Callback>}
         */
        this.Callbacks = new Map();

        CallbackRegistry.#instance = this;
    }

    /**
     * Add a new Callback to the registry
     * @param {string} name
     * @param {Callback} value
     * @returns {void}
     */
    set(name, value) {
        this.Callbacks.set(name, value);
    }

    /**
     * Return a Callback by name
     * @param {string} name
     * @returns {Callback}
     */
    get(name) {
        return this.Callbacks.get(name);
    }

    /**
     * Check if Callback exists
     * @param {string} name
     * @returns {boolean}
     */
    has(name) {
        return this.Callbacks.has(name);
    }

    /**
     * Delete a Callback
     * @param {string} name
     * @returns {boolean}
     */
    delete(name) {
        return this.Callbacks.delete(name);
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

export default CallbackRegistry;