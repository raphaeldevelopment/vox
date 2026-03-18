import { createEffect } from "../effects/createEffect";
import { VariableRegistry } from "../variables/VariableRegistry";
import { VOX_ATTR_SELECTOR } from "./consts";
import { guardNode } from "../utils/guardNode";
import { toCamelCase } from "../utils/toCamelCase";
import { ElementObserver } from "../dom/ElementObserver";
import { Variable } from "../variables/Variable";

export const checkAttributes = (parentNode = document.documentElement) => {
    const variableRegistry = VariableRegistry.getInstance();
    const elementObserver = ElementObserver.getInstance();
    const variableNodes = Array.from(parentNode.querySelectorAll("*"))
        .filter(el =>
            Array.from(el.attributes).some(attr =>
                attr.name.startsWith(VOX_ATTR_SELECTOR)
            )
        );

    variableNodes.forEach(node => {
        const nodeAttributes = Array.from(node.attributes)
            .filter(attr => attr.name.startsWith(VOX_ATTR_SELECTOR))
            .map(attr => ({
                name: attr.name,
                value: attr.value
            }));
        nodeAttributes.forEach(attr => {
            const attrName = attr.name.replace(VOX_ATTR_SELECTOR, "");
            const variableName = attr.value;
            if (!variableRegistry.has(variableName, node)) {
                return;
            }
            const variable: Variable<any> = variableRegistry.get(variableName, node) as Variable<any>;
            let cleanup = () => {};
            const guard = (init: any, cleanup: Function) => guardNode(node as HTMLElement, `voxAttr${toCamelCase(attrName)}Set`, variableName, init, cleanup); 

            const logic = (init: boolean) => {
                try {
                    guard(init, cleanup);
                    node.setAttribute(attrName, `${variable}`);  

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
    })
}