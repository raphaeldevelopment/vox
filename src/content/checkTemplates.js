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

        if (cacheTemplate[templatePath]) {
            template = cacheTemplate[templatePath];
        } else {
            response = await fetch(templatePath);
            template = await response.text();
            cacheTemplate[templatePath] = template;
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

        createEffect(() => {
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