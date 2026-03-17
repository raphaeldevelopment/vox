import { Variable } from "./Variable.js";
import { createVariable } from "./createVariable.js";

export const compose = formula => {
    const deps = new Set();
    let initialValue;
    let [variable, setVariable] = [];
    let noVariables = null;

    const callFunction = () => {
        try {
            Variable.setCollector(deps);
            initialValue = formula();
        } finally {
            Variable.setCollector(null);
            const newNoVariables = [...deps].length;

            if (noVariables === null) {
                noVariables = newNoVariables;
            } else if (noVariables !== newNoVariables) {
                console.log(initialValue);
                setVariable(callFunction, [...deps], initialValue);
                noVariables = newNoVariables;
            }
        }
        
        return initialValue;
    }

    callFunction();

    [variable, setVariable] = createVariable(callFunction, [...deps], initialValue);

    return variable;
}