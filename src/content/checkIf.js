import { createEffect } from "../dependency/createEffect.js";
import { VariableRegistry } from "./VariableRegistry.js";
import { VOX_ATTR_IF_SELECTOR } from "./consts.js";

const cacheChild = node => {
    const cache = document.createDocumentFragment();

    while (node.firstChild) {
        cache.appendChild(node.firstChild);
    }

    return cache;
}

/**
 * Initialize the variables on DOM elements
 */
export const checkIf = () => {
    const variableRegistry = VariableRegistry.getInstance();
    const variableNodes = document.querySelectorAll(`[${VOX_ATTR_IF_SELECTOR}]`);

    variableNodes.forEach(node => {
        const variableName = node.getAttribute(VOX_ATTR_IF_SELECTOR);

        if (variableRegistry.has(variableName)) {
            const variable = variableRegistry.get(variableName);
            let cache = null;
            
            if (variable.getValue()) {
                if (cache) {
                    node.appendChild(cache);
                    cache = null;
                }
            } else {
                if (!cache) {
                    cache = cacheChild(node);
                }
            }

            createEffect(() => {
                console.log(variable.getValue());
                if (variable.getValue()) {
                    if (cache) {
                        node.appendChild(cache);
                        cache = null;
                    }
                } else {
                    if (!cache) {
                        cache = cacheChild(node);
                    }
                }
            }, [variable])
        }
    })

}