import { createEffect } from "../effects/createEffect.js";
import { CallbackRegistry } from "../callbacks/CallbackRegistry.js";
import { VariableRegistry } from "../variables/VariableRegistry.js";
import { VOX_ATTR_VALUE_SELECTOR } from "./consts.js";
import { guardNode } from "../utils/guardNode.js";
import { State } from "../state/State.js";
import { ElementObserver } from "../dom/ElementObserver.js";

/**
 * Initialize the value on an input element
 */
export const checkValue = (parentNode = document) => {
    const variableRegistry = VariableRegistry.getInstance();
    const callbackRegistry = CallbackRegistry.getInstance();
    const elementObserver = ElementObserver.getInstance();
    const variableNodes = parentNode.querySelectorAll(`[${VOX_ATTR_VALUE_SELECTOR}]`);

    variableNodes.forEach(node => {
        const variableName = node.getAttribute(VOX_ATTR_VALUE_SELECTOR);

        if (!variableRegistry.has(variableName, node)) {
            return;
        }
        const isState = variableName.indexOf("->") > -1;
        const state = State.getInstance();
        const variable = isState ? state.get(...variableName.split("->")) : variableRegistry.get(variableName, node);
        let cleanup = () => {};
        const guard = (init, cleanup) => guardNode(node, `voxValueSet`, variableName, init, cleanup);

        const logic = init => {
            try {
                guard(init, cleanup);

                node.value = `${variable}`;                
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

        const context = variableRegistry.getContextName(variableName, node);
        if (!isState && !callbackRegistry.hasStrict(variableName, context)) {
            return;
        }
        const callback = callbackRegistry.getStrict(variableName, context);
        node.addEventListener("input", (e) => {
            if (isState) {
                return variable = e.target.value;
            }
            return callback(e.target.value);
        });
    })

}