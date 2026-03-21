import { Directive } from "../directive/directive.interface";
import { VariableContext } from "../dom/VariableContext";

export const checkContextsLogic: Directive = ({node}) => {    
    const variableContext = VariableContext.getInstance();

    variableContext.addContext(node);
}