import { CallbackRegistry } from "../callbacks/CallbackRegistry";
import { Directive } from "../directive/directive.interface";
import { VOX_EVENT_SELECTOR } from "./consts";

export const addEventsLogic: Directive = opts => {
    const {
        callbackRegistry,
        node
    } = opts;
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
            node.removeAttribute(attr.name);
            
            node.addEventListener(eventName, event => callback(event));
        }
    })
}