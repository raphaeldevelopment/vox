import { createEffect } from "../effects/createEffect.js";
import { CallbackRegistry } from "../callbacks/CallbackRegistry.js";
import { VariableRegistry } from "../variables/VariableRegistry.js";
import { VOX_ATTR_VALUE_SELECTOR } from "./consts.js";
import { guardNode } from "../utils/guardNode.js";
import { State } from "../state/State.js";
import { ElementObserver } from "../dom/ElementObserver.js";
import { parseVariableName } from "./utils/parseVariableName.js";
import { getVariableValue } from "./utils/getVariableValue.js";
import { getUpdatedValue } from "./utils/getUpdatedValue.js";

/**
 * Initialize the value on an input element
 */
export const checkValue = (parentNode = document) => {
    const variableRegistry = VariableRegistry.getInstance();
    const callbackRegistry = CallbackRegistry.getInstance();
    const elementObserver = ElementObserver.getInstance();
    const state = State.getInstance();
    const variableNodes = parentNode.querySelectorAll(`[${VOX_ATTR_VALUE_SELECTOR}]`);

    variableNodes.forEach(node => {
        const variableName = node.getAttribute(VOX_ATTR_VALUE_SELECTOR);
        const parsedVariableName = parseVariableName(variableName);
        const { isState, keys } = parsedVariableName;
        const root = isState ? state : variableRegistry;

        if (!isState && !variableRegistry.has(keys[0].index, node)) {            
            return;
        }
        let cleanup = () => {};
        const guard = (init, cleanup) => guardNode(node, `voxValueSet`, variableName, init, cleanup);
        const variableValue = getVariableValue(root, keys);
        const variable = variableValue.variable;
        let value = variableValue.value;

        const logic = init => {
            try {
                guard(init, cleanup);

                node.value = `${value}`;                
                if (init) {     
                    cleanup = createEffect(() => {
                        value = getVariableValue(root, keys).value;
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
        if (!isState && !callbackRegistry.hasStrict(keys[0].index, context)) {
            return;
        }
        const callback = callbackRegistry.getStrict(keys[0].index, context);
        node.addEventListener("input", (e) => {
            const newValue = getUpdatedValue(root, keys, e.target.value);
            if (isState) {
                return variable.setValue(newValue);
            }
            return callback(newValue);
        });
    })

}