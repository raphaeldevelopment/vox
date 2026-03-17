import { Variable } from "./Variable.js";
import { createVariable } from "./createVariable.js";

export const compose = formula => {
    const deps = new Set();

    Variable.setCollector(deps);
    const initialValue = formula();
    Variable.setCollector(null);
    
    return createVariable(formula, [...deps], initialValue)[0];
}