import { createEffect } from "../effects/createEffect.js";
import { VariableRegistry } from "../variables/VariableRegistry.js";
import { VOX_ATTR_TEMPLATE_SELECTOR } from "./consts.js";
import { guardNode } from "../utils/guardNode.js";
import { ElementObserver } from "../dom/ElementObserver.js";

const cacheTemplate = new Map();
/**
 * Initialize the loaded templates
 */
export const checkTemplates = async () => {
    const variableRegistry = VariableRegistry.getInstance();
    const variableNodes = document.querySelectorAll(`[${VOX_ATTR_TEMPLATE_SELECTOR}]`);
    const elementObserver = ElementObserver.getInstance();

    for (const node of variableNodes) {
        const templatePath = node.getAttribute(VOX_ATTR_TEMPLATE_SELECTOR);
        let response, template;
        let cleanup = () => {};
        const guard = (init, cleanup) => guardNode(node, `voxTemplateSet`, templatePath, init, cleanup);   
        let variables = [];
        if (cacheTemplate.has(templatePath)) {
            template = cacheTemplate.get(templatePath);
        } else {
            response = await fetch(templatePath);
            template = await response.text();
            cacheTemplate.set(templatePath, template);
        }

        const logic = init => {
            try {
                guard(init, cleanup);    
                variables = []

                const parsedTemplate = template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
                    key = key.trim();
                    if (!variableRegistry.has(key, node)) {
                        return '';
                    }
                    const currentVariable = variableRegistry.get(key, node);
                    variables.push(currentVariable);
                    return currentVariable;
                });
                node.innerHTML = parsedTemplate;   

                if (init) {     
                    cleanup = createEffect(() => {
                        logic(false);
                    }, variables);
                    elementObserver.addElement(node, cleanup);
                }
            } catch (err) {
                cleanup();
                console.warn(err);
            }
        }

        logic(true);
    };

}