export const getUpdatedValue = (root, keys, newValue) => {
    let variable = root;
    let index = 0;

    try {
        // Găsește cea mai apropiată variabilă reactivă
        for (index = 0; index < keys.length; index++) {
            const key = keys[index];

            if (key.type === "object" && typeof variable?.get === "function") {
                variable = variable.get(key.index);
                continue;
            }

            break;
        }

        if (variable && ("value" in variable)) {
            variable = variable.value;
        }

        if (variable && ("getValue" in variable)) {
            variable = variable.getValue();
        }

        const value = structuredClone(variable);
        let increment = value;

        while (index < keys.length - 1 && typeof increment[keys[index].index] === "object") { 
            increment = increment[keys[index].index]; 
            index++; 
        }

        const lastKey = keys[index]?.index;
        if (typeof lastKey === "undefined") {
            throw new Error("Missing final key");
        }

        increment[lastKey] = newValue;

        return value;
    } catch (err) {
        console.warn(`Error: ${JSON.stringify(keys)} - ${err}`);
        return null;
    }
};