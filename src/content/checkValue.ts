import { createEffect } from "../effects/createEffect";
import { CallbackRegistry } from "../callbacks/CallbackRegistry";
import { VariableRegistry } from "../variables/VariableRegistry";
import { VOX_ATTR_VALUE_SELECTOR } from "./consts";
import { guardNode } from "../utils/guardNode";
import { State } from "../state/State";
import { ElementObserver } from "../dom/ElementObserver";
import { parseVariableName } from "./utils/parseVariableName";
import { getVariableValue } from "./utils/getVariableValue";
import { getUpdatedValue } from "./utils/getUpdatedValue";
import { InputCheckbox, InputField } from "../dom/InputField";

/**
 * Initialize the value on an input element
 */
export const checkValue = (parentNode = document.documentElement) => {
    const variableRegistry = VariableRegistry.getInstance();
    const callbackRegistry = CallbackRegistry.getInstance();
    const elementObserver = ElementObserver.getInstance();
    const state = State.getInstance();
    const variableNodes = parentNode.querySelectorAll(`[${VOX_ATTR_VALUE_SELECTOR}]`);

    variableNodes.forEach(node => {
        const wrapper = InputField.create(node as HTMLInputElement);
        const variableName = node.getAttribute(VOX_ATTR_VALUE_SELECTOR) || "";
        const parsedVariableName = parseVariableName(variableName);
        const { isState, keys } = parsedVariableName;
        const root = isState ? state : variableRegistry;

        if (!isState && !variableRegistry.has(keys[0].index as string, node)) {            
            return;
        }
        let cleanup = () => {};
        const guard = (init: boolean, cleanup: Function) => guardNode(node as HTMLElement, `voxValueSet`, variableName, init, cleanup);
        const variableValue = getVariableValue(root, keys);
        const variable = variableValue.variable;
        let value: any = variableValue.value;

        const logic = (init: boolean) => {
            try {
                guard(init, cleanup);
                if (wrapper instanceof InputCheckbox) {
                    wrapper.changeValue(value);
                } else {
                    wrapper.changeValue(value);
                }
                             
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
        if (!isState && !callbackRegistry.hasStrict(keys[0].index as string, context)) {
            return;
        }
        const callback = callbackRegistry.getStrict(keys[0].index as string, context);
        wrapper.addChangeEvent((value: any) => {
            const newValue = getUpdatedValue(root, keys, value);
            if (isState) {
                return variable.setValue(newValue);
            }
            return callback?.run(newValue);
        });
    })

}