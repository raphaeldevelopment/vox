import { createEffect } from "../effects/createEffect.js";
import { VariableRegistry } from "../utils/VariableRegistry.js";
import { VOX_ATTR_SELECTOR } from "./consts.js";

/**
 * Update attribute based on variables
 * attr must be set as vox-attr-${attr-name}=${variable}
 */
export const checkAttributes = () => {
    const variableRegistry = VariableRegistry.getInstance();
    const variableNodes = Array.from(document.querySelectorAll("*"))
        .filter(el =>
            Array.from(el.attributes).some(attr =>
                attr.name.startsWith(VOX_ATTR_SELECTOR)
            )
        );

    variableNodes.forEach(node => {
        const nodeAttributes = Array.from(node.attributes)
            .filter(attr => attr.name.startsWith("vox-attr-"))
            .map(attr => ({
                name: attr.name,
                value: attr.value
            }));
        nodeAttributes.forEach(attr => {
            const attrName = attr.name.replace(VOX_ATTR_SELECTOR, "");
            const variableName = attr.value;
            if (variableRegistry.has(variableName)) {
                const variable = variableRegistry.get(variableName);

                node.setAttribute(attrName, `${variable}`);
                createEffect(() => {
                    node.setAttribute(attrName, `${variable}`);
                }, [variable])
            }
        })
    })
}