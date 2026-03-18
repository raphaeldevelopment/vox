import { WatchCallback, Unsubscribe } from "./Variable.interface";

export class Variable<T> {
    static collector: Set<Variable<any>> | null;
    /** @type {T} */
    #value: T;
    #addEvent: (event: WatchCallback) => Unsubscribe;
    
    constructor(value: T, addEvent: (event: WatchCallback) => Unsubscribe) {
        this.#value = value;
        this.#addEvent = addEvent;
    }

    static setCollector(collector: Set<Variable<any>> | null) {        
        Variable.collector = collector;
    }

    static getCollector(): Set<Variable<any>> | null {        
        return Variable.collector;
    }
    /**
     * Get the add event function
     * @returns {function(function(...*): void): void} 
     */
    getAddEvent(): (event: WatchCallback) => Unsubscribe {
        return this.#addEvent;
    }

    setValue(newValue: T) {
        this.#value = newValue;
    }
    
    getValue(): T {
        if (Variable.collector) {
            Variable.collector.add(this);
        }
        return this.#value;
    }

    peek(): T {
        return this.#value;
    }
    
    [Symbol.toPrimitive](): T {
        if (Variable.collector) {
            Variable.collector.add(this);
        }
        return this.#value;
    }
}