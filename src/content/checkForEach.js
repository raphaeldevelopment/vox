import { createEffect } from "../effects/createEffect.js";
import { VariableRegistry } from "../variables/VariableRegistry.js";
import { VOX_ATTR_FOR_EACH_SELECTOR } from "./consts.js";
import { guardNode } from "../utils/guardNode.js";
import { ElementObserver } from "../dom/ElementObserver.js";

const parseRule = rule => {
    const parts = rule.split (" in ");
    const partName = parts[0].trim();
    const variableName = parts[1].trim();

    return {
        partName,
        variableName
    }
}

const updateAttributes = (node, variableName, partName) => {
    const templateAttrs = [...node.attributes].filter(attr => attr.value === partName);
    templateAttrs.forEach(attr => {
        node.setAttribute(attr.name, variableName);
    });

    [...node.children].forEach(child => updateAttributes(child, variableName, partName));
}

const replaceWith = (node, variable, cache) => {
    const rule = node.getAttribute(VOX_ATTR_FOR_EACH_SELECTOR);
    const parsedRule = parseRule(rule);
    const { partName, variableName} = parsedRule;
    let values = variable.getValue();

    if (!Array.isArray(values)) {
        values = [values];
    }

    const nodes = values.map((value, index) => {
        let newNode = null;
        if (cache.has(value)) {
            newNode = cache.get(value);
        } else {
            newNode = node.cloneNode(true);
            newNode.removeAttribute(VOX_ATTR_FOR_EACH_SELECTOR);
            cache.set(value, newNode);
        }
        Object.keys(newNode.dataset).forEach(key =>{
            if (key.startsWith("vox")) {
                delete newNode.dataset[key];
            }
        })
        updateAttributes(newNode, `${variableName}.[${index}]`, partName);
        return newNode;
    })
    if (nodes.length > 0) {
        node.replaceWith(...nodes);
    } else {        
        node.style.display = 'none';
    }

    return nodes;
}

const undoReplaceWith = (node, nodes) => {
    if (!nodes[0]) {
        node.style.display = 'block';
        return;
    }
    nodes[0].replaceWith(node);

    for (let i = 1; i < nodes.length; i++) {
        nodes[i].remove();
    }
}
/**
 * Initialize the for each element in DOM
 */
export const checkForEach = (voxRestart) => {
    const variableRegistry = VariableRegistry.getInstance();
    const variableNodes = document.querySelectorAll(`[${VOX_ATTR_FOR_EACH_SELECTOR}]`);
    const elementObserver = ElementObserver.getInstance();

    variableNodes.forEach(node => {
        const rule = node.getAttribute(VOX_ATTR_FOR_EACH_SELECTOR);
        const parsedRule = parseRule(rule);
        const container = node.parentNode;
        const { variableName} = parsedRule;
        let cleanup = () => {};

        if (!variableRegistry.has(variableName, node)) {
            return;
        }
        const guard = (init, cleanup) => guardNode(container, `voxForEachSet`, variableName, init, cleanup);        
        const variable = variableRegistry.get(variableName, node);
        let nodes = null;
        const cache = new Map();

        const logic = init => {
            try {
                guard(init, cleanup);    
                if (!init) {                    
                    undoReplaceWith(node, nodes);
                }            
                nodes = replaceWith(node, variable, cache);
                
                if (!init) { 
                    if (nodes.length > 0) {
                        voxRestart(nodes[0].parentElement)
                    }
                }  

                if (init) {     
                    cleanup = createEffect(() => {
                        logic(false);
                    }, [variable]);
                    elementObserver.addElement(node, cleanup);
                }
            } catch (err) {
                cleanup();
                console.warn(err);
            }
        }

        logic(true);
    })

}