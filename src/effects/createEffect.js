import { Variable } from "./Variable.js";

const sameDeps = (a, b) =>
    a.size === b.size && [...a].every(dep => b.has(dep));

const getVariables = (variables, callback) => {
    if (variables) {
        return new Set(variables);
    }

    const callFunction = () => {
        const deps = new Set();

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

const addDependencies = (deps, callback) => {   
    const cleanupFns = [];
    
    deps.forEach(variable => {
        /** @type {function(Function): void} */
        const addEvent = variable.getAddEvent();

        cleanupFns.push(addEvent(callback));
    })

    return cleanupFns;
}

/**
 * Call the callback function each time a variable changes
 * @param {function(...*): void} callback 
 * @param {Array<Variable>} variables 
 */
export const createEffect = (callback, variables) => {
    let cleanupFns = [];
    let deps = getVariables(variables, callback);
    let clearFunction = () => {};

    const callbackWrapper = variables ? 
        callback : 
        (...args) => {
            try {
                const newDeps = new Set();
                Variable.setCollector(newDeps);
                callback(...args);
            } finally {
                Variable.setCollector(null);

                if (!sameDeps(newDeps, deps)) {
                    clearFunction();
                    deps = newDeps;
                    cleanupFns = addDependencies(deps, callbackWrapper);
                }
            }
        }

    cleanupFns = addDependencies([...deps], callbackWrapper);

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