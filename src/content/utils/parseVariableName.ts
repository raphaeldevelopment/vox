import { ParseVariableInterface } from "./ParseVariable.interface";

export const parseVariableName = (variableName: string): ParseVariableInterface => {
    const isState = variableName.indexOf("->") > -1;
    const splitter = isState ? "->" : ".";
    const variableParts = variableName.split(splitter);

    return {
        isState,
        keys: variableParts.map(key => {
            const isArrayElement = key.match(/^\[(\d+)\]$/);
            if (isArrayElement) {
                return {
                    type: "array",
                    index: Number(isArrayElement[1])
                }
            }
            return {
                type: "object",
                index: key
            }
        })
    }
}