/**
 * Registration of all variables that affect DOM elements
 */
export class VariableRegistry {
    static #instance = null;

    constructor() {
        if (VariableRegistry.#instance) {
            return VariableRegistry.#instance;
        }

        /**
         * @private
         * @type {Map<string, Variable>}
         */
        this.variables = new Map();

        VariableRegistry._instance = this;
    }

    /**
     * Add a new variable to the registry
     * @param {string} name
     * @param {Variable} value
     * @returns {void}
     */
    set(name, value) {
        this.variables.set(name, value);
    }

    /**
     * Return a variable by name
     * @param {string} name
     * @returns {Variable}
     */
    get(name) {
        return this.variables.get(name);
    }

    /**
     * Check if variable exists
     * @param {string} name
     * @returns {boolean}
     */
    has(name) {
        return this.variables.has(name);
    }

    /**
     * Delete a variable
     * @param {string} name
     * @returns {boolean}
     */
    delete(name) {
        return this.variables.delete(name);
    }

    /**
     * Return the instance
     * @returns {VariableRegistry}
     */
    static getInstance() {
        if (!VariableRegistry._instance) {
            VariableRegistry.#instance = new VariableRegistry();
        }
        return VariableRegistry.#instance;
    }
}

export default VariableRegistry;