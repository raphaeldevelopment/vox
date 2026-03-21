import { createEffect } from "../effects/createEffect";
import { VariableRegistry } from "../variables/VariableRegistry";
import { VOX_ATTR_TEMPLATE_SELECTOR } from "./consts";
import { guardNode } from "../utils/guardNode";
import { ElementObserver } from "../dom/ElementObserver";
import { Variable } from "../variables/Variable";
import { Directive } from "../directive/directive.interface";

const cacheTemplate = new Map();

export const checkTemplatesLogic: Directive = async opts => {
    const {
        variableRegistry,
        elementObserver,
        guard,
        value: templatePath,
        node
    } = opts;

    let response, template;
    let cleanup = () => {};   
    let variables: Array<Variable<any>> = [];
    if (cacheTemplate.has(templatePath)) {
        template = cacheTemplate.get(templatePath);
    } else {
        response = await fetch(templatePath);
        template = await response.text();
        cacheTemplate.set(templatePath, template);
    }

    const logic = (init: boolean) => {
        try {
            guard(node, init, cleanup);    
            variables = []

            const parsedTemplate = template.replace(/\{\{(.*?)\}\}/g, (_: any, key: string) => {
                key = key.trim();
                if (!variableRegistry.has(key, node)) {
                    return '';
                }
                const currentVariable = variableRegistry.get(key, node);
                variables.push(currentVariable as Variable<any>);
                return currentVariable;
            });
            node.innerHTML = parsedTemplate;   

            if (init) {     
                cleanup = createEffect(() => {
                    debugger;
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
}