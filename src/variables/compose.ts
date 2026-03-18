import { Callback } from "../callbacks/Callback";
import { Variable } from "./Variable";
import { createVariable } from "./createVariable";

const sameDeps = (a: Set<Variable<any>>, b: Set<Variable<any>>): boolean =>
    a.size === b.size && [...a].every(dep => b.has(dep));

export const compose = (formula: Function): Variable<any> => {
    let deps: Set<Variable<any>> = new Set();
    let initialValue: any;
    let variable: Variable<any>;
    let setVariable: Callback;
    let currentDeps: Set<Variable<any>> | null = null;

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
                setVariable.run(callFunction, [...deps], initialValue);
                currentDeps = deps;
            }
        }
        
        return initialValue;
    }

    callFunction();

    [variable, setVariable] = createVariable(callFunction, [...deps], initialValue);

    return variable;
}