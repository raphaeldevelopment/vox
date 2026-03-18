export const getVariableValue = (root, keys) => {
    let value = root;
    let variable = null;

    try {
        keys.forEach(key => {
            if (key.type === "object") {
                if (typeof value.get === "function") {
                    value = value.get(key.index);
                    variable = value;
                } else if (typeof value[key.index] !== "undefined") {
                    value = value[key.index];
                } else {
                    throw new Error("Object key does not exist")
                }
            }

            if (key.type === "array") {
                if (typeof value[key.index] !== "undefined") {
                    value = value[key.index];
                } else {
                    throw new Error("Array is not valid")
                }
            }

            if (value?.value) {
                value = value.value;
            }

            if (value?.getValue) {
                value = value.getValue();
            }

            if (variable?.value) {
                variable = variable.value;
            }
        })
    } catch (err) {
        console.warn(`Error: ${JSON.stringify(keys)} - ${err}`);
        return {variable: null, value: null, err: err};
    }

    return {variable, value};
}
