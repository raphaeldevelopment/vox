import { createEffect } from "../effects/createEffect";
import { VOX_ATTR_FOR_EACH_SELECTOR } from "./consts";
import { Variable } from "../variables/Variable";
import { Directive } from "../directive/directive.interface";

const parseRule = (rule: string) => {
    const parts = rule.split (" in ");
    const partName = parts[0].trim();
    const variableName = parts[1].trim();

    return {
        partName,
        variableName
    }
}

const updateAttributes = (node: HTMLElement, variableName: string, partName: string) => {
    const templateAttrs = [...node.attributes].filter(attr => attr.value === partName);
    templateAttrs.forEach(attr => {
        node.setAttribute(attr.name, variableName);
    });

    [...node.children].forEach(child => updateAttributes(child as HTMLElement, variableName, partName));
}

const replaceWith = (node: HTMLElement, variable: Variable<any>, cache: Map<string, HTMLElement>) => {
    const rule = node.getAttribute(VOX_ATTR_FOR_EACH_SELECTOR) || "";
    const parsedRule = parseRule(rule);
    const { partName, variableName} = parsedRule;
    let values = variable.getValue();

    if (!Array.isArray(values)) {
        values = [values];
    }

    const nodes = values.map((value: any, index: number) => {
        let newNode = null;
        if (cache.has(value)) {
            newNode = cache.get(value);
        } else {
            newNode = node.cloneNode(true) as HTMLElement;
            newNode.removeAttribute(VOX_ATTR_FOR_EACH_SELECTOR);
            cache.set(value, newNode);
        }
        Object.keys(newNode?.dataset || {}).forEach(key =>{
            if (key.startsWith("vox")) {
                delete newNode?.dataset[key];
            }
        })
        updateAttributes(newNode as HTMLElement, `${variableName}.[${index}]`, partName);
        return newNode;
    })
    if (nodes.length > 0) {
        node.replaceWith(...nodes);
    } else {        
        node.style.display = 'none';
    }

    return nodes;
}

const undoReplaceWith = (node: HTMLElement, nodes: Array<HTMLElement>) => {
    if (!nodes[0]) {
        node.style.display = 'block';
        return;
    }
    nodes[0].replaceWith(node);

    for (let i = 1; i < nodes.length; i++) {
        nodes[i].remove();
    }
}

export const checkForEachLogic: Directive = opts => {
    const {
        variableRegistry,
        elementObserver,
        guard,
        value,
        voxRestart,
        node
    } = opts;

    const parsedRule = parseRule(value || "");
    const container = node.parentNode?.parentElement;
    const { variableName} = parsedRule;
    let cleanup = () => {};

    if (!variableRegistry.has(variableName, node)) {
        return;
    }     
    const variable = variableRegistry.get(variableName, node);
    let nodes: Array<HTMLElement> | null = null;
    const cache: Map<string, HTMLElement> = new Map();

    const logic = (init: boolean) => {
        try {
            guard(container as HTMLElement, init, cleanup);    
            if (!init && nodes) {                    
                undoReplaceWith(node as HTMLElement, nodes);
            }            
            if (variable) {
                nodes = replaceWith(node as HTMLElement, variable, cache);
            }
            
            if (!init) { 
                if (nodes && nodes.length > 0) {
                    voxRestart(container as HTMLElement)
                }
            }  


            if (init) {     
                cleanup = createEffect(() => {
                    logic(false);
                }, [variable as Variable<any>]);
                elementObserver.addElement(container as HTMLElement, cleanup);
            }
        } catch (err) {
            cleanup();
            console.warn(err);
        }
    }

    logic(true);
}