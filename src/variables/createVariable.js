import {Variable} from "./Variable.js";
import {Callback} from "../callbacks/Callback.js";
import {EffectsStack} from "../effects/EffectsStack.js";
import {createEffect} from "../effects/createEffect.js";

export const createVariable = (initialValue, variables = [], computedValue) => {
    /** @type {Set<function(T, T): void>} */
    const events = new Set();
    let variableCleanup = null;

    /** @type {function(function(T, T): void): void} */
    const addEvent = event => {
        events.add(event);

        return () => {
            events.delete(event);
        }
    }

    const triggerEvents = (newValue, oldValue) => {
        const effectsStack = EffectsStack.getInstance();

        events.forEach(event => {
            effectsStack.addEffect(() => event(newValue, oldValue));
        });
    };

    const attachDerivedEffect = (variable, getter, variables) => {
        return createEffect(() => {
            const oldValue = variable.getValue();
            const calculated = getter();

            if (Object.is(calculated, oldValue)) {
                return;
            }

            variable.setValue(calculated);
            triggerEvents(calculated, oldValue);
        }, variables);
    };

    const createInitialVariable = (initialValue, variables = [], computedValue) => {
        let variable = null;
        if (typeof initialValue === "function") {
            variable = new Variable(computedValue || initialValue(), addEvent);

            if (variables.length > 0) {
                variableCleanup = attachDerivedEffect(variable, initialValue, variables);
            }
        } else {
            variable = new Variable(initialValue, addEvent);
        }

        return variable;
    }

    const variable = createInitialVariable(initialValue, variables, computedValue);

    const setVariable = (newValue, variables = [], initialValue) => {
        if (variableCleanup) {
            variableCleanup();
            variableCleanup = null;
        }

        if (typeof newValue === "function" && variables.length > 0) {
            variableCleanup = attachDerivedEffect(variable, newValue, variables);
        }

        const oldValue = variable.getValue();
        const calculated = typeof newValue === "function" ? initialValue || newValue() : newValue;

        if (Object.is(calculated, oldValue)) {
            return;
        }

        variable.setValue(calculated);
        triggerEvents(calculated, oldValue);
    };


    return [variable, new Callback(setVariable)];
}