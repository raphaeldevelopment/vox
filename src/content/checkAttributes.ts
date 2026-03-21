import { createEffect } from "../effects/createEffect";
import { VOX_ATTR_SELECTOR } from "./consts";
import { toCamelCase } from "../utils/toCamelCase";
import { Variable } from "../variables/Variable";
import { Directive } from "../directive/directive.interface";

export const checkAttributesLogic: Directive = opts => {
    const {
        variableRegistry,
        elementObserver,
        guard,
        value: variableName,
        node
    } = opts;
    
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

        const logic = (init: boolean) => {
            try {
                guard(node, init, cleanup, `voxAttr${toCamelCase(attrName)}Set`);
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
}