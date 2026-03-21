import { createEffect } from "../effects/createEffect";
import { Variable } from "../variables/Variable";
import { Directive } from "../directive/directive.interface";

const cacheChild = (node: HTMLElement) => {
    const cache = document.createDocumentFragment();

    while (node.firstChild) {
        cache.appendChild(node.firstChild);
    }

    return cache;
}

export const checkIfLogic: Directive = opts => {
    const {
        variableRegistry,
        elementObserver,
        guard,
        value: variableName,
        node
    } = opts;
    let cleanup = () => {};
    let cache: DocumentFragment | null = null;
    const variable = variableRegistry.get(variableName, node);        

    const logic = (init: boolean) => {
        try {
            guard(node, init, cleanup);
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
}