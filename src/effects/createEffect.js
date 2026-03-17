/**
 * Call the callback function each time a variable changes
 * @param {function(...*): void} callback 
 * @param {Array<Variable>} variables 
 */
export const createEffect = (callback, variables) => {
    const deleteEventsStack = [];
    
    variables.forEach(variable => {
        /** @type {function(Function): void} */
        const addEvent = variable.getAddEvent();

        deleteEventsStack.push(addEvent(callback));
    })

    return () => {
        deleteEventsStack.forEach(deleteEvent => {
            if (typeof deleteEvent === "function") {
                deleteEvent();
            }
        })
    }
}