import { Callback } from "../callbacks/Callback";
import { Variable } from "../variables/Variable";

const sameDeps = (a: Set<Variable<any>>, b: Set<Variable<any>>): boolean =>
    a.size === b.size && [...a].every(dep => b.has(dep));

const getVariables = (variables: ReadonlyArray<Variable<any>>, callback: Function): Set<Variable<any>> => {
    if (variables) {
        return new Set(variables);
    }

    const callFunction = () => {
        const deps: Set<Variable<any>> = new Set();

        try {
            Variable.setCollector(deps);
            callback();
        } finally {
            Variable.setCollector(null);
        }

        return deps;
    }

    return callFunction();
}

const addDependencies = (deps: Set<Variable<any>>, callback: () => void): Array<Function> => {   
    const cleanupFns: Array<() => void> = [];
    
    [...deps].forEach(variable => {
        const addEvent = variable.getAddEvent();

        cleanupFns.push(addEvent(callback));
    })

    return cleanupFns;
}

export const createEffect = (callback: () => void, variables: ReadonlyArray<Variable<any>>) => {
    let cleanupFns: Array<Function> = [];
    let deps: Set<Variable<any>> = getVariables(variables, callback);
    let clearFunction = () => {};

    const callbackWrapper = variables ? 
        callback : 
        () => {
            const newDeps: Set<Variable<any>> = new Set();
            try {
                Variable.setCollector(newDeps);
                callback();
            } finally {
                Variable.setCollector(null);

                if (!sameDeps(newDeps, deps)) {
                    clearFunction();
                    deps = newDeps;
                    cleanupFns = addDependencies(deps, callbackWrapper);
                }
            }
        }

    cleanupFns = addDependencies(deps, callbackWrapper);

    if (Array.isArray(variables) && variables.length === 0) {
        callbackWrapper();
    }

    clearFunction = () => {
        cleanupFns.forEach(deleteEvent => {
            if (typeof deleteEvent === "function") {
                deleteEvent();
            }
        })
    }

    return clearFunction;
}