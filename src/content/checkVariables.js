import { createEffect } from "../effects/createEffect.js";
import { VariableRegistry } from "../variables/VariableRegistry.js";
import { VOX_ATTR_VARIABLE_SELECTOR } from "./consts.js";
import { guardNode } from "../utils/guardNode.js";
import { State } from "../state/State.js";
import { ElementObserver } from "../dom/ElementObserver.js";
import { parseVariableName } from "./utils/parseVariableName.js";
import { getVariableValue } from "./utils/getVariableValue.js";

/**
 * Initialize the variables on DOM elements
 */
export const checkVariables = (parentNode = document) => {
    const variableRegistry = VariableRegistry.getInstance();
    const state = State.getInstance();
    const elementObserver = ElementObserver.getInstance();
    const variableNodes = parentNode.querySelectorAll(`[${VOX_ATTR_VARIABLE_SELECTOR}]`);

    variableNodes.forEach(node => {
        const variableName = node.getAttribute(VOX_ATTR_VARIABLE_SELECTOR);
        const parsedVariableName = parseVariableName(variableName);
        const { isState, keys } = parsedVariableName;
        const root = isState ? state : variableRegistry;

        if (!isState && !variableRegistry.has(keys[0].index, node)) {
            return;
        }

        if (isState && !state.has(keys[0].index)) {
            return;
        }

                
        let cleanup = () => {};
        const guard = (init, cleanup) => guardNode(node, `voxVariableSet`, variableName, init, cleanup);

        const logic = init => {
            try {
                guard(init, cleanup);
                
                const {variable, value } = getVariableValue(root, keys);

                node.innerHTML = typeof value === "object" ? JSON.stringify(value) : value;               
                if (init) {     
                    cleanup = createEffect(() => {
                        logic(false);
                    }, [variable]);
                    elementObserver.addElement(node, cleanup);
                }
            } catch (err) {
                cleanup();
                console.warn(err);
            }
        }

        logic(true);  
    })

}