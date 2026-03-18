export class Callback {
    #call?: Function;
    
    constructor(call: Function) {
        this.#call = call;

        const callable = (...args: Array<any>) => this.run(...args);

        callable.setValue = this.setValue.bind(this);
        callable.run = this.run.bind(this);

        return callable;
    }

    setValue(call: Function) {
        this.#call = call;
    }
    
    run(...args: Array<any>) {
        return this.#call?.(...args);
    }
}