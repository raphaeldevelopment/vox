import { VariableContext } from "../dom/VariableContext.js";

export const checkContexts = () => {    
    const variableContext = VariableContext.getInstance();

    [...document.querySelectorAll('[vox-context]')]
        .forEach(element => variableContext.addContext(element));
}