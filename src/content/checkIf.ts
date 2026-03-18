import { createEffect } from "../effects/createEffect";
import { VariableRegistry } from "../variables/VariableRegistry";
import { VOX_ATTR_IF_SELECTOR } from "./consts";
import { guardNode } from "../utils/guardNode";
import { ElementObserver } from "../dom/ElementObserver";
import { Variable } from "../variables/Variable";

const cacheChild = (node: HTMLElement) => {
    const cache = document.createDocumentFragment();

    while (node.firstChild) {
        cache.appendChild(node.firstChild);
    }

    return cache;
}

/**
 * Initialize the variables on DOM elements
 */
export const checkIf = (parentNode = document.documentElement) => {
    const variableRegistry = VariableRegistry.getInstance();
    const elementObserver = ElementObserver.getInstance();
    const variableNodes = parentNode.querySelectorAll(`[${VOX_ATTR_IF_SELECTOR}]`);

    variableNodes.forEach(node => {
        const variableName = node.getAttribute(VOX_ATTR_IF_SELECTOR) || "";
        let cleanup = () => {};
        let cache: DocumentFragment | null = null;
        const variable = variableRegistry.get(variableName, node);
        const guard = (init: boolean, cleanup: Function) => guardNode(node as HTMLElement, `voxIfSet`, variableName, init, cleanup);        

        const logic = (init: boolean) => {
            try {
                guard(init, cleanup);
                if (variable?.getValue()) {
                    if (cache) {
                        node.appendChild(cache);
                        cache =  null;
                    }
                } else {
                    if (!cache) {
                        cache = cacheChild(node as HTMLElement);
                    }
                }    

                if (init) {     
                    cleanup = createEffect(() => {
                        logic(false);
                    }, [variable as Variable<any>]);
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