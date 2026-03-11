import { createEffect } from "../effects/createEffect.js";
import { CallbackRegistry } from "../utils/CallbackRegistry.js";
import { VariableRegistry } from "../utils/VariableRegistry.js";
import { VOX_ATTR_VALUE_SELECTOR } from "./consts.js";
import { guardNode } from "../utils/guardNode.js";

/**
 * Initialize the value on an input element
 */
export const checkValue = (parentNode = document) => {
    const variableRegistry = VariableRegistry.getInstance();
    const callbackRegistry = CallbackRegistry.getInstance();
    const variableNodes = parentNode.querySelectorAll(`[${VOX_ATTR_VALUE_SELECTOR}]`);

    variableNodes.forEach(node => {
        const variableName = node.getAttribute(VOX_ATTR_VALUE_SELECTOR);

        if (!variableRegistry.has(variableName)) {
            return;
        }
        const variable = variableRegistry.get(variableName);
        let cleanup = () => {};
        const guard = (init, cleanup) => guardNode(node, `voxValueSet`, variableName, init, cleanup);

        const logic = init => {
            try {
                guard(init, cleanup);

                node.value = `${variable}`;                
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

        if (!callbackRegistry.has(variableName)) {
            return;
        }
        const callback = callbackRegistry.get(variableName);
        node.addEventListener("input", (e) => {
            callback(e.target.value);
        });
    })

}