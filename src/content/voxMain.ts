import { checkForEachLogic } from "./checkForEach";
import { checkIfLogic } from "./checkIf";
import { checkVariablesLogic } from "./checkVariables";
import { checkValueLogic } from "./checkValue";
import { checkTemplatesLogic } from "./checkTemplates";
import { addEventsLogic } from "./addEvents";
import { checkContextsLogic } from "./checkContexts";
import { DirectiveRegistry } from "../directive/DirectiveRegistry";
import { VOX_ATTR_CONTEXT_SELECTOR, VOX_ATTR_FOR_EACH_SELECTOR, VOX_ATTR_IF_SELECTOR, VOX_ATTR_SELECTOR, VOX_ATTR_TEMPLATE_SELECTOR, VOX_ATTR_VALUE_SELECTOR, VOX_ATTR_VARIABLE_SELECTOR, VOX_EVENT_SELECTOR } from "./consts";
import { checkAttributesLogic } from "./checkAttributes";

export const voxRestart = (parentNode?: HTMLElement) => {
    const directiveRegistry = DirectiveRegistry.getInstance();

    directiveRegistry.restart(parentNode);
}
/**
 * Main call to run VOX
 */
export const voxMain = async () => {
    const directiveRegistry = DirectiveRegistry.getInstance();
    directiveRegistry.set({
        name: "voxForEach",
        key: VOX_ATTR_FOR_EACH_SELECTOR,
        selector: `[${VOX_ATTR_FOR_EACH_SELECTOR}]`,
        logic: checkForEachLogic
    })
    directiveRegistry.set({
        name: "voxTemplate",
        key: VOX_ATTR_TEMPLATE_SELECTOR,
        selector: `[${VOX_ATTR_TEMPLATE_SELECTOR}]`,
        logic: checkTemplatesLogic
    })
    directiveRegistry.set({
        name: "voxCheckContext",
        key: VOX_ATTR_CONTEXT_SELECTOR,
        selector: `[${VOX_ATTR_CONTEXT_SELECTOR}]`,
        logic: checkContextsLogic
    })
    directiveRegistry.set({
        name: "voxVariable",
        key: VOX_ATTR_VARIABLE_SELECTOR,
        selector: `[${VOX_ATTR_VARIABLE_SELECTOR}]`,
        logic: checkVariablesLogic
    }, true)
    directiveRegistry.set({
        name: "voxAttribute",
        key: VOX_ATTR_SELECTOR,
        selector: (parentNode: HTMLElement = document.documentElement) => {
            return Array.from(parentNode.querySelectorAll("*"))
                .filter(el =>
                    Array.from(el.attributes).some(attr =>
                        attr.name.startsWith(VOX_ATTR_SELECTOR)
                    )
                );
        },
        logic: checkAttributesLogic
    }, true)    
    directiveRegistry.set({
        name: "voxValue",
        key: VOX_ATTR_VALUE_SELECTOR,
        selector: `[${VOX_ATTR_VALUE_SELECTOR}]`,
        logic: checkValueLogic
    }, true) 
    directiveRegistry.set({
        name: "voxIf",
        key: VOX_ATTR_IF_SELECTOR,
        selector: `[${VOX_ATTR_IF_SELECTOR}]`,
        logic: checkIfLogic
    }, true)
    directiveRegistry.set({
        name: "voxEvent",
        key: VOX_EVENT_SELECTOR,
        selector: (parentNode: HTMLElement = document.documentElement) => {
            return Array.from(parentNode.querySelectorAll("*"))
                .filter(el =>
                    Array.from(el.attributes).some(attr =>
                        attr.name.startsWith(VOX_EVENT_SELECTOR)
                    )
                );
        },
        logic: addEventsLogic
    }, true)   

    directiveRegistry.execute();

    voxRestart();
}