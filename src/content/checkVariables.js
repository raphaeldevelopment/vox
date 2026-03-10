import { createDependency } from "../dependency/createDependency.js";
import { VariableRegistry } from "./VariableRegistry.js";
import { VOX_ATTR_VARIABLE_SELECTOR } from "./consts.js";

/**
 * Initialize the variables on DOM elements
 */
export const checkVariables = () => {
    const variableRegistry = VariableRegistry.getInstance();
    const variableNodes = document.querySelectorAll(`[${VOX_ATTR_VARIABLE_SELECTOR}]`);

    variableNodes.forEach(node => {
        const variableName = node.getAttribute(VOX_ATTR_VARIABLE_SELECTOR);

        if (variableRegistry.has(variableName)) {
            const variable = variableRegistry.get(variableName);

            node.innerHTML = `${variable}`;
            createDependency(() => {
                node.innerHTML = `${variable}`;
            }, [variable])
        }
    })

}