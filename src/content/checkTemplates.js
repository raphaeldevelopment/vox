import { createEffect } from "../dependency/createEffect.js";
import { VariableRegistry } from "./VariableRegistry.js";
import { VOX_ATTR_TEMPLATE_SELECTOR } from "./consts.js";

/**
 * Initialize the value on an input element
 */
export const checkTemplates = async () => {
    const variableRegistry = VariableRegistry.getInstance();
    const variableNodes = document.querySelectorAll(`[${VOX_ATTR_TEMPLATE_SELECTOR}]`);

    variableNodes.forEach(async node => {
        const templatePath = node.getAttribute(VOX_ATTR_TEMPLATE_SELECTOR);

        const response = await fetch(templatePath);
        const template = await response.text();
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
    })

}