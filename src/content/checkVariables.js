import { createEffect } from "../effects/createEffect.js";
import { VariableRegistry } from "../utils/VariableRegistry.js";
import { VOX_ATTR_VARIABLE_SELECTOR } from "./consts.js";
import { guardNode } from "../utils/guardNode.js";
import { State } from "../state/State.js";

const parseVariableName = variableName => {
    const splitter = variableName.indexOf("->") > -1 ? "->" : ".";
    const variableParts = variableName.split(splitter);

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
        parsedVariable.type = splitter === "." ? "variable" : "state";
    }

    return parsedVariable;
}

const getVariableValue = (variable, parsedVariableName) => {
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
        const { variableName, type, key } = parsedVariableName;
        const state = State.getInstance();

        if (type === "variable" && !variableRegistry.has(variableName)) {
            return;
        }

        if (type === "state" && !state.has(variableName, key)) {
            return;
        }
        const variable = type === "state" ? state.get(variableName, key) : variableRegistry.get(variableName);
        let cleanup = () => {};
        const guard = (init, cleanup) => guardNode(node, `voxVariableSet`, variableName, init, cleanup);

        const logic = init => {
            try {
                guard(init, cleanup);

                node.innerHTML = type === "state" ? variable : getVariableValue(variable, parsedVariableName);               
                if (init) {     
                    cleanup = createEffect(() => {
                        logic(false);
                    }, [variable]);
                }
            } catch (err) {
                cleanup();
                console.warn(err);
            }
        }

        logic(true);  
    })

}