import { createEffect } from "../dependency/createEffect.js";
import { VariableRegistry } from "./VariableRegistry.js";
import { VOX_ATTR_FOR_EACH_SELECTOR } from "./consts.js";

const parseRule = rule => {
    const parts = rule.split (" in ");
    const partName = parts[0].trim();
    const variableName = parts[1].trim();

    return {
        partName,
        variableName
    }
}

const updateAttributes = (node, variableName, partName, index) => {
    const templateAttrs = [...node.attributes].filter(attr => attr.value === partName);
    templateAttrs.forEach(attr => {
        node.setAttribute(attr.name, variableName);
    });

    [...node.children].forEach(child => updateAttributes(child, variableName, partName));
}

const replaceWith = (node, variable) => {
    const rule = node.getAttribute(VOX_ATTR_FOR_EACH_SELECTOR);
    const parsedRule = parseRule(rule);
    const { partName, variableName} = parsedRule;
    let values = variable.getValue();

    if (!Array.isArray(values)) {
        values = [values];
    }

    const nodes = values.map((value, index) => {
        const newNode = node.cloneNode(true);
        console.log(node);
        updateAttributes(newNode, `${variableName}.[${index}]`, partName);
        newNode.removeAttribute(VOX_ATTR_FOR_EACH_SELECTOR);
        return newNode;
    })
    node.replaceWith(...nodes);

    return nodes;
}

const undoReplaceWith = (node, nodes) => {
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

    variableNodes.forEach(node => {
        const rule = node.getAttribute(VOX_ATTR_FOR_EACH_SELECTOR);
        const parsedRule = parseRule(rule);
        const { variableName} = parsedRule;

        if (variableRegistry.has(variableName)) {
            const variable = variableRegistry.get(variableName);
            let nodes = replaceWith(node, variable);

            createEffect(() => {
                undoReplaceWith(node, nodes);
                nodes = replaceWith(node, variable);
                voxRestart(nodes[0].parentElement)
            }, [variable])
        }
    })

}