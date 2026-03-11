import { createEffect } from "../effects/createEffect.js";
import { VariableRegistry } from "../utils/VariableRegistry.js";
import { VOX_ATTR_TEMPLATE_SELECTOR } from "./consts.js";

const cacheTemplate = new Map();
/**
 * Initialize the loaded templates
 */
export const checkTemplates = async () => {
    const variableRegistry = VariableRegistry.getInstance();
    const variableNodes = document.querySelectorAll(`[${VOX_ATTR_TEMPLATE_SELECTOR}]`);

    for (const node of variableNodes) {
        const templatePath = node.getAttribute(VOX_ATTR_TEMPLATE_SELECTOR);
        let response, template;

        if (cacheTemplate.has(templatePath)) {
            template = cacheTemplate.get(templatePath);
        } else {
            response = await fetch(templatePath);
            template = await response.text();
            cacheTemplate.set(templatePath, template);
        }

        const variables = [];

        const parsedTemplate = template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
            key = key.trim();
            if (variableRegistry.has(key)) {
                const currentVariable = variableRegistry.get(key);
                variables.push(currentVariable);
                return currentVariable;
            }
            return '';
        });

        node.innerHTML = parsedTemplate;

        const cleanup = createEffect(() => {
            if (!node.isConnected) {
                cleanup();
                return;
            }
                
            variables.length = 0;
            const parsedTemplate = template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
                key = key.trim();
                if (variableRegistry.has(key)) {
                    const currentVariable = variableRegistry.get(key);
                    variables.push(currentVariable);
                    return currentVariable;
                }
                return '';
            });

            node.innerHTML = parsedTemplate;
        }, variables)
    };

}