import { createEffect } from "../effects/createEffect";
import { VariableRegistry } from "../variables/VariableRegistry";
import { VOX_ATTR_VARIABLE_SELECTOR } from "./consts";
import { guardNode } from "../utils/guardNode";
import { State } from "../state/State";
import { ElementObserver } from "../dom/ElementObserver";
import { parseVariableName } from "./utils/parseVariableName";
import { getVariableValue } from "./utils/getVariableValue";

/**
 * Initialize the variables on DOM elements
 */
export const checkVariables = (parentNode = document.documentElement) => {
    const variableRegistry = VariableRegistry.getInstance();
    const state = State.getInstance();
    const elementObserver = ElementObserver.getInstance();
    const variableNodes = parentNode.querySelectorAll(`[${VOX_ATTR_VARIABLE_SELECTOR}]`);

    variableNodes.forEach(node => {
        const variableName = node.getAttribute(VOX_ATTR_VARIABLE_SELECTOR) || "";
        const parsedVariableName = parseVariableName(variableName);
        const { isState, keys } = parsedVariableName;
        const root = isState ? state : variableRegistry;

        if (!isState && !variableRegistry.has(keys[0].index as string, node)) {
            return;
        }

        if (isState && !state.has(keys[0].index as string)) {
            return;
        }

                
        let cleanup = () => {};
        const guard = (init: boolean, cleanup: Function) => guardNode(node as HTMLElement, `voxVariableSet`, variableName, init, cleanup);

        const logic = (init: boolean) => {
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