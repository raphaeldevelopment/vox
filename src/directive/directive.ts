import { VariableRegistry } from "../variables/VariableRegistry";
import { ElementObserver } from "../dom/ElementObserver";
import { guardNode } from "../utils/guardNode";
import { voxRestart } from "../content/voxMain";
import { DirectiveOptions } from "./directive.interface";
import { State } from "../state/State";
import { CallbackRegistry } from "../callbacks/CallbackRegistry";

export const directive = async (options: DirectiveOptions, parentNode = document.documentElement) => {
    const { 
        name, 
        key, 
        onBefore, 
        selector, 
        logic 
    } = options;

    const variableRegistry = VariableRegistry.getInstance();
    const callbackRegistry = CallbackRegistry.getInstance();
    const state = State.getInstance();
    let variableNodes: Array<Element>;
    if (typeof selector === "string") {
        variableNodes = Array.from(parentNode.querySelectorAll(selector));
    } else if (typeof selector === "function") {
        variableNodes = selector(parentNode);
    } else {
        return;
    }

    const elementObserver = ElementObserver.getInstance();

    if (typeof onBefore === "function") {
        onBefore();
    }

    variableNodes.forEach(async node => {
        const value = node.getAttribute(key) || "";
        const guard = (node: HTMLElement, init: boolean, cleanup: Function, variableName = value) => guardNode(node, name, variableName, init, cleanup);  

        await logic({
            variableRegistry,
            callbackRegistry,
            state,
            elementObserver,
            guard,
            value,
            voxRestart,
            node: node as HTMLElement
        })
    });
}