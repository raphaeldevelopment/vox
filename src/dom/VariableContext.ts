export const CONTEXT_MAIN: string = "main";

export class VariableContext {
    static #instance: VariableContext | null = null;
    #contexts: WeakMap<Element, string | null> = new WeakMap();

    constructor() {
        if (VariableContext.#instance) {
            return VariableContext.#instance;
        }
        
        this.#contexts = new WeakMap();

        VariableContext.#instance = this;
    }

    addContext(node: Element) {
        this.#contexts.set(node, node.getAttribute("vox-context"));
    }

    getContext(node: Element = document.documentElement): Array<string> {
        if (!(node instanceof Element)) {
            return [];
        }
        let current: HTMLElement | null = node.parentElement;
        let allContexts: Array<string> = [];

        while (current) {
            if (this.#contexts.has(current)) {
                const context = this.#contexts.get(current);
                if (typeof context === "string") {
                    allContexts.push(context);
                }
            }

            current = current.parentElement;
        }

        allContexts.push(CONTEXT_MAIN);

        return allContexts;
    }
    
    static getInstance(): VariableContext {
        if (!VariableContext.#instance) {
            VariableContext.#instance = new VariableContext();
        }
        return VariableContext.#instance;
    }
}