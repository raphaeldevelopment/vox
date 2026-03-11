import { createEffect } from "../effects/createEffect.js";
import { CallbackRegistry } from "../utils/CallbackRegistry.js";
import { VariableRegistry } from "../utils/VariableRegistry.js";
import { VOX_ATTR_VALUE_SELECTOR, VOX_ATTR_SET_VALUE_SELECTOR } from "./consts.js";

/**
 * Initialize the value on an input element
 */
export const checkValue = () => {
    const variableRegistry = VariableRegistry.getInstance();
    const callbackRegistry = CallbackRegistry.getInstance();
    const variableNodes = document.querySelectorAll(`[${VOX_ATTR_VALUE_SELECTOR}]`);

    variableNodes.forEach(node => {
        const variableName = node.getAttribute(VOX_ATTR_VALUE_SELECTOR);

        if (variableRegistry.has(variableName)) {
            const variable = variableRegistry.get(variableName);

            node.value = `${variable}`;
            const cleanup = createEffect(() => {
                if (!node.isConnected) {
                    cleanup();
                    return;
                }
                
                node.value = `${variable}`;
            }, [variable]);

            if (callbackRegistry.has(variableName)) {
                const callback = callbackRegistry.get(variableName);
                node.addEventListener("input", (e) => {
                    callback(e.target.value);
                });
            }
        }
    })

}