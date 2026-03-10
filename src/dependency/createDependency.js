/**
 * Call the callback function each time a variable changes
 * @param {function(...*): void} callback 
 * @param {Array<Variable>} variables 
 */
export const createDependency = (callback, variables) => {
    variables.forEach(variable => {
        /** @type {function(Function): void} */
        const addEvent = variable.getAddEvent();

        addEvent(callback);
    })
}