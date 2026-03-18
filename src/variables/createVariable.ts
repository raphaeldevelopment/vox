import {Variable} from "./Variable";
import {Callback} from "../callbacks/Callback";
import {EffectsStack} from "../effects/EffectsStack";
import {createEffect} from "../effects/createEffect";
import { Unsubscribe, WatchCallback } from "./Variable.interface";

export function createVariable<T>(initialValue: T, variables: Array<Variable<any>> = [], computedValue?: T): [Variable<any>, Callback] {
    const events: Set<Function> = new Set();
    let variableCleanup: Function | null = null;

    const addEvent = (event: WatchCallback): Unsubscribe => {
        events.add(event);

        return () => {
            events.delete(event);
        }
    }

    const triggerEvents = (newValue: T, oldValue: T) => {
        const effectsStack = EffectsStack.getInstance();

        events.forEach(event => {
            effectsStack.addEffect(() => event(newValue, oldValue));
        });
    };

    const attachDerivedEffect = (variable: Variable<any>, getter: Function, variables: Array<Variable<any>>): Function => {
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

    const createInitialVariable = (initialValue: T, variables: Array<Variable<any>> = [], computedValue: T | undefined): Variable<any> => {
        let variable: Variable<any> | null = null;
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

    const setVariable = (newValue: T, variables: Array<Variable<any>> = [], initialValue: T) => {
        if (variableCleanup) {
            variableCleanup();
            variableCleanup = null;
        }

        if (typeof newValue === "function" && variables.length > 0) {
            variableCleanup = attachDerivedEffect(variable, newValue, variables);
        }

        const oldValue: T = variable.getValue();
        const calculated: T = typeof newValue === "function" ? initialValue || newValue() : newValue;

        if (Object.is(calculated, oldValue)) {
            return;
        }

        variable.setValue(calculated);
        triggerEvents(calculated, oldValue);
    };


    return [variable, new Callback(setVariable)];
}