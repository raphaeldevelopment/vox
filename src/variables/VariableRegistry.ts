import { VariableContext, CONTEXT_MAIN } from "../dom/VariableContext";
import { Variable } from "./Variable";
import { ContextVariables } from "./VariableRegistry.interface";

/**
 * Registration of all variables that affect DOM elements
 */
export class VariableRegistry {
    static #instance: VariableRegistry | null = null;
    #variables: Map<string, ContextVariables> | null = null;
    #variableContext: VariableContext | null = null;

    constructor() {
        if (VariableRegistry.#instance) {
            return VariableRegistry.#instance;
        }
        
        this.#variableContext = VariableContext.getInstance();
        this.#variables = new Map();

        VariableRegistry.#instance = this;
    }

    set(name: string, value: Variable<any>, context = CONTEXT_MAIN) {
        if (!this.#variables?.has(context)) {
            this.#variables?.set(context, new Map());
        }
        this.#variables?.get(context)?.set(name, value);
    }

    get(name: string, node: Element): Variable<any> | null {
        const contexts = this.#variableContext?.getContext(node);
        if (!contexts) {
            return null;
        }
        const context = contexts.find(cont => 
            this.#variables?.has(cont) && this.#variables?.get(cont)?.has(name));

        if (context === undefined) {
            return null;
        }

        return this.#variables?.get(context)?.get(name) || null;
    }

    getContextName(name: string, node: Element): string {
        const contexts = this.#variableContext?.getContext(node);
        if (!contexts) {
            return CONTEXT_MAIN;
        }
        const context = contexts.find(cont => this.#variables?.has(cont) && this.#variables?.get(cont)?.has(name));

        if (context === undefined) {
            return CONTEXT_MAIN;
        }

        return context;
    }

    has(name: string, node: Element): boolean {
        const contexts = this.#variableContext?.getContext(node);
        if (!contexts) {
            return false;
        }
        return contexts.some(cont => this.#variables?.has(cont) && this.#variables?.get(cont)?.has(name));
    }

    delete(name: string, context = CONTEXT_MAIN): boolean {
        if (!this.#variables?.has(context) || !this.#variables?.get(context)?.has(name)) {
            return false;
        }
        return this.#variables?.get(context)?.delete(name) || false;
    }

    static getInstance(): VariableRegistry {
        if (!VariableRegistry.#instance) {
            VariableRegistry.#instance = new VariableRegistry();
        }
        return VariableRegistry.#instance;
    }
}