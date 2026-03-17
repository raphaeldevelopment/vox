export class VariableContext {
    static #instance = null;
    #contexts = null;

    constructor() {
        if (VariableContext.#instance) {
            return VariableContext.#instance;
        }
        
        this.#contexts = new WeakMap();

        VariableContext.#instance = this;
    }

    addContext(node) {
        this.#contexts.set(node, node.getAttribute("vox-context"));
    }

    getContext(node = document) {
        if (!node instanceof Element) {
            return [];
        }
        let current = node.parentElement;
        let allContexts = [];

        while (current) {
            if (this.#contexts.has(current)) {
                allContexts.push(this.#contexts.get(current));
            }

            current = current.parentElement;
        }

        return allContexts;
    }
    
    static getInstance() {
        if (!VariableContext.#instance) {
            VariableContext.#instance = new VariableContext();
        }
        return VariableContext.#instance;
    }
}