/**
 * A Variable in the Vox tool
 * @template T
 */
export class Callback {
    /** @type {T} */
    #call;
    /**
     * Create a new Variable
     * @param {T} value initial value of the Callback
     * @param {function(function(...*): void): void} addEvent function to be called 
     */
    constructor(call) {
        this.#call = call;

        const callable = (...args) => this.run(...args);

        callable.setValue = this.setValue.bind(this);
        callable.run = this.run.bind(this);

        return callable;
    }

    /** Sets the value
     * @param {T} call the new value
     */
    setValue(call) {
        this.#call = call;
    }
    
    /** Call functions
     * @returns {T} value
     */
    run(...args) {
        return this.#call(...args);
    }
}