import { VariableContext, CONTEXT_MAIN } from "../dom/VariableContext";
import { Callback } from "./Callback";
import { ContextCallbacks } from "./CallbackRegistry.interface";


export class CallbackRegistry {
    static #instance: CallbackRegistry | null = null;
    #callbacks: Map<string, ContextCallbacks> | null = null;
    #variableContext: VariableContext | null = null;

    constructor() {
        if (CallbackRegistry.#instance) {
            return CallbackRegistry.#instance;
        }
        /**
         * @private
         * @type {Map<string, Callback>}
         */
        this.#callbacks = new Map();
        this.#variableContext = VariableContext.getInstance();

        CallbackRegistry.#instance = this;
    }

    /**
     * Add a new Callback to the registry
     * @param {string} name
     * @param {Callback} value
     * @returns {void}
     */
    set(name: string, value: Callback, context = CONTEXT_MAIN) {
        if (!this.#callbacks?.has(context)) {
            this.#callbacks?.set(context, new Map());
        }
        this.#callbacks?.get(context)?.set(name, value);
    }

    get(name: string, node: Element): Callback | null {
        const contexts = this.#variableContext?.getContext(node);
        if (!contexts) {
            return null;
        }
        const context = contexts.find(
            cont => this.#callbacks?.has(cont) && this.#callbacks?.get(cont)?.has(name)
        );

        if (context === undefined) {
            return null;
        }

        return this.#callbacks?.get(context)?.get(name) || null;
    }

    getStrict(name: string, context = CONTEXT_MAIN): Callback | null {
        if (!this.hasStrict(name, context)) {
            return null;
        }

        return this.#callbacks?.get(context)?.get(name) || null;
    }
    
    has(name: string, node: Element): boolean {
        const contexts = this.#variableContext?.getContext(node);
        if (!contexts) {
            return false;
        }
        return contexts.some(cont => this.#callbacks?.has(cont) && this.#callbacks?.get(cont)?.has(name));
    }

    hasStrict(name: string, context = CONTEXT_MAIN): boolean {
        return this.#callbacks?.has(context) && this.#callbacks?.get(context)?.has(name) || false;
    }
    
    delete(name: string, context = CONTEXT_MAIN): boolean {
        if (!this.#callbacks?.has(context) || !this.#callbacks?.get(context)?.has(name)) {
            return false;
        }
        return this.#callbacks?.get(context)?.delete(name) || false;
    }
    
    static getInstance(): CallbackRegistry {
        if (!CallbackRegistry.#instance) {
            CallbackRegistry.#instance = new CallbackRegistry();
        }
        return CallbackRegistry.#instance;
    }
}