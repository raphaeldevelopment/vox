import { CallbackRegistry } from "../callbacks/CallbackRegistry";
import { VOX_EVENT_SELECTOR } from "./consts";

/**
 * Update attribute based on variables
 * attr must be set as vox-attr-${attr-name}=${variable}
 */
export const addEvents = (parentNode = document.documentElement) => {
    const callbackRegistry = CallbackRegistry.getInstance();
    const variableNodes = Array.from(parentNode.querySelectorAll("*"))
        .filter(el =>
            Array.from(el.attributes).some(attr =>
                attr.name.startsWith(VOX_EVENT_SELECTOR)
            )
        );
        
    variableNodes.forEach(node => {
        const nodeAttributes = Array.from(node.attributes)
            .filter(attr => attr.name.startsWith(VOX_EVENT_SELECTOR))
            .map(attr => ({
                name: attr.name,
                value: attr.value
            }));
        nodeAttributes.forEach(attr => {
            const eventName: keyof ElementEventMap = attr.name.replace(`${VOX_EVENT_SELECTOR}:`, "") as keyof ElementEventMap;
            const variableName = attr.value;
            if (callbackRegistry.has(variableName, node)) {
                const callback = callbackRegistry.get(variableName, node);

                if (!callback) {
                    return;
                }
                
                node.addEventListener(eventName, callback.run);
            }
        })
    })
}