import { createEffect } from "../effects/createEffect";
import { parseVariableName } from "./utils/parseVariableName";
import { getVariableValue } from "./utils/getVariableValue";
import { Directive } from "../directive/directive.interface";

export const checkVariablesLogic: Directive = opts => {
    const {
        variableRegistry,
        state,
        elementObserver,
        guard,
        value: variableName,
        node
    } = opts;
    
    const parsedVariableName = parseVariableName(variableName);
    const { isState, keys } = parsedVariableName;
    const root = isState ? state : variableRegistry;

    if (!isState && !variableRegistry.has(keys[0].index as string, node)) {
        return;
    }

    if (isState && !state.has(keys[0].index as string)) {
        return;
    }

            
    let cleanup = () => {};
    const logic = (init: boolean) => {
        try {
            guard(node, init, cleanup);
            
            const {variable, value } = getVariableValue(root, keys);

            node.innerHTML = typeof value === "object" ? JSON.stringify(value) : value;               
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

}