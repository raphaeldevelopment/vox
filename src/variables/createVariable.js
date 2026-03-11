import {Variable} from "../utils/Variable.js";
import {Callback} from "../utils/Callback.js";
import {EffectsStack} from "../utils/EffectsStack.js";

/**
 * Create a fresh variable
 * @template T
 * @param {T} initialValue
 * @returns {Array<T|function(T): void>} [valoare, setter]
 */
export const createVariable = initialValue => {
    /** @type {Array<function(T, T): void>} */
    const events = new Set();

    /** @type {function(function(T, T): void): void} */
    const addEvent = event => {
        events.add(event);

        return () => {
            events.delete(event);
        }
    }

    /** @type {Variable<T>} */
    const variable = new Variable(initialValue, addEvent);
    
    /** Sets the new value
     * @param {T} newValue the new value
     */
    const setVariable = newValue => {
        /** @type {T} */
        const oldValue = variable.getValue();
        const effectsStack = EffectsStack.getInstance();
        if (Object.is(oldValue, newValue)) {
            return;
        }
        variable.setValue(newValue);

        events.forEach(event => effectsStack.addEffect(event.bind(event, newValue, oldValue)));
    }

    return [variable, new Callback(setVariable)];
}