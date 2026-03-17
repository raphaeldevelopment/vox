import { createEffect } from "../effects/createEffect.js";
import { VariableRegistry } from "../variables/VariableRegistry.js";
import { VOX_ATTR_IF_SELECTOR } from "./consts.js";
import { guardNode } from "../utils/guardNode.js";
import { ElementObserver } from "../dom/ElementObserver.js";

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
export const checkIf = (parentNode = document) => {
    const variableRegistry = VariableRegistry.getInstance();
    const elementObserver = ElementObserver.getInstance();
    const variableNodes = parentNode.querySelectorAll(`[${VOX_ATTR_IF_SELECTOR}]`);

    variableNodes.forEach(node => {
        const variableName = node.getAttribute(VOX_ATTR_IF_SELECTOR);
        let cleanup = () => {};
        let cache = null;
        const variable = variableRegistry.get(variableName, node);
        const guard = (init, cleanup) => guardNode(node, `voxIfSet`, variableName, init, cleanup);        

        const logic = init => {
            try {
                guard(init, cleanup);
                if (variable.getValue()) {
                    if (cache) {
                        node.appendChild(cache);
                        cache =  null;
                    }
                } else {
                    if (!cache) {
                        cache = cacheChild(node);
                    }
                }    

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

            return cache;
        }

        logic(true);
    })

}