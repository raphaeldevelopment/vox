export class ElementObserver {
    static #instance = null;
    #registry = null;

    constructor() {
        if (ElementObserver.#instance) {
            return ElementObserver.#instance;
        }

        this.#registry = new WeakMap();
        this.#observer();
        
        ElementObserver.#instance = this;
    }

    addElement(node, callback) {
        if (typeof callback !== "function") {
            return;
        }

        if (!this.#registry.has(node)) {
            this.#registry.set(node, new Set());
        }

        this.#registry.get(node).add(callback);
    }

    #observer() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.removedNodes.forEach(node => this.#checkNode(node));
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    #executeCallbacks(node) {
        if (this.#registry.has(node)) {
            const callbacks = this.#registry.get(node);
            callbacks.forEach(callback => {
                try {
                    callback(node);
                } catch (error) {
                    console.error('ElementObserver callback error:', error);
                }
            });
            this.#registry.delete(node);
        }
    }

    #checkNode(node) {
        this.#executeCallbacks(node);

        node.querySelectorAll?.('*').forEach(child => {
            this.#executeCallbacks(child);
        });
    }

    static getInstance() {
        if (!ElementObserver.#instance) {
            ElementObserver.#instance = new ElementObserver();
        }
        return ElementObserver.#instance;
    }
}