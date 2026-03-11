import { createEffect } from "../effects/createEffect.js";
import { VariableRegistry } from "../utils/VariableRegistry.js";
import { VOX_ATTR_SELECTOR } from "./consts.js";
import { guardNode } from "../utils/guardNode.js";
import { toCamelCase } from "../utils/toCamelCase.js";

/**
 * Update attribute based on variables
 * attr must be set as vox-attr-${attr-name}=${variable}
 */
export const checkAttributes = (parentNode = document) => {
    const variableRegistry = VariableRegistry.getInstance();
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
            if (!variableRegistry.has(variableName)) {
                return;
            }
            const variable = variableRegistry.get(variableName);
            let cleanup = () => {};
            const guard = (init, cleanup) => guardNode(node, `voxAttr${toCamelCase(attrName)}Set`, variableName, init, cleanup); 

            const logic = init => {
                try {
                    guard(init, cleanup);
                    node.setAttribute(attrName, `${variable}`);
                } catch (err) {
                    cleanup();
                    console.warn(err);
                }
            }
            
            logic(true);
            cleanup = createEffect(() => {
                logic(false);
            }, [variable])
        })
    })
}