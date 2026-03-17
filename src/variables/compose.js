import { Variable } from "./Variable.js";
import { createVariable } from "./createVariable.js";

const sameDeps = (a, b) =>
    a.size === b.size && [...a].every(dep => b.has(dep));

export const compose = formula => {
    let deps;
    let initialValue;
    let [variable, setVariable] = [];
    let currentDeps = null;

    const callFunction = () => {
        try {
            deps = new Set();
            Variable.setCollector(deps);
            initialValue = formula();
        } finally {
            Variable.setCollector(null);

            if (currentDeps === null) {
                currentDeps = deps;
            } else if (setVariable && !sameDeps(currentDeps, deps)) {
                setVariable(callFunction, [...deps], initialValue);
                currentDeps = deps;
            }
        }
        
        return initialValue;
    }

    callFunction();

    [variable, setVariable] = createVariable(callFunction, [...deps], initialValue);

    return variable;
}