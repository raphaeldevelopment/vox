/**
 * A Variable in the Vox tool
 * @template T
 */
export class Variable {
    /** @type {T} */
    #value;
    /** @type {function(Function): void} */
    #addEvent;
    /**
     * Create a new Variable
     * @param {T} value initial value of the Variable
     * @param {function(function(...*): void): void} addEvent function to be called 
     */
    constructor(value, addEvent) {
        this.#value = value;
        this.#addEvent = addEvent;
    }

    /**
     * Get the add event function
     * @returns {function(function(...*): void): void} 
     */
    getAddEvent() {
        return this.#addEvent;
    }

    /** Sets the value
     * @param {T} newValue the new value
     */
    setValue(newValue) {
        this.#value = newValue;
    }
    
    /** Get the value
     * @returns {T} value
     */
    getValue() {
        return this.#value;
    }

    /**
     * Convert the value
     * @returns {T}
     */
    [Symbol.toPrimitive]() {
        return this.#value;
    }
}