import { createDependency } from "../dependency/createDependency.js";
import { VariableRegistry } from "./VariableRegistry.js";
import { VOX_ATTR_VALUE_SELECTOR, VOX_ATTR_SET_VALUE_SELECTOR } from "./consts.js";

/**
 * Initialize the variables on DOM elements
 */
export const checkValue = () => {
    const variableRegistry = VariableRegistry.getInstance();
    const variableNodes = document.querySelectorAll(`[${VOX_ATTR_VALUE_SELECTOR}]`);

    variableNodes.forEach(node => {
        const variableName = node.getAttribute(VOX_ATTR_VALUE_SELECTOR);
        const setVariableName = node.getAttribute(VOX_ATTR_SET_VALUE_SELECTOR);

        if (variableRegistry.has(variableName)) {
            const variable = variableRegistry.get(variableName);

            node.value = `${variable}`;
            createDependency(() => {
                console.log("here");
                node.value = `${variable}`;
            }, [variable]);

            if (variableRegistry.has(setVariableName)) {
                const setVariable = variableRegistry.get(setVariableName);
                node.addEventListener("input", (e) => {
                    console.log(variable);
                    setVariable(e.target.value);
                });
            }
        }
    })

}