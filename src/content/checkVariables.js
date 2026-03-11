import { createEffect } from "../effects/createEffect.js";
import { VariableRegistry } from "../utils/VariableRegistry.js";
import { VOX_ATTR_VARIABLE_SELECTOR } from "./consts.js";

const parseVariableName = variableName => {
    const variableParts = variableName.split(".");

    const parsedVariable = {
        variableName: variableParts[0]
    }

    if (variableParts[1]) {
        const isArrayElement = variableParts[1].match(/^\[(\d+)\]$/);
        const index = isArrayElement ? Number(isArrayElement[1]) : null;
        if (Number.isInteger(index)) {
            parsedVariable.index = index
        } else {
            parsedVariable.key = variableParts[1];
        }
    }

    return parsedVariable;
}

const getValue = (variable, parsedVariableName) => {
    const { index, key } = parsedVariableName;

    if (Number.isInteger(index)) {
        return `${variable.getValue()[index]}`;
    } else if (key) {
        return `${variable.getValue()[key]}`;
    } else {
        return `${variable}`;
    }
}

/**
 * Initialize the variables on DOM elements
 */
export const checkVariables = (parentNode = document) => {
    const variableRegistry = VariableRegistry.getInstance();
    const variableNodes = parentNode.querySelectorAll(`[${VOX_ATTR_VARIABLE_SELECTOR}]`);

    variableNodes.forEach(node => {
        const parsedVariableName = parseVariableName(node.getAttribute(VOX_ATTR_VARIABLE_SELECTOR));
        const { variableName } = parsedVariableName;

        if (variableRegistry.has(variableName)) {
            const variable = variableRegistry.get(variableName);
            node.innerHTML = getValue(variable, parsedVariableName);
            const cleanup = createEffect(() => {
                if (!node.isConnected) {
                    cleanup();
                    return;
                }
                
                node.innerHTML = getValue(variable, parsedVariableName);
            }, [variable])
        }
    })

}