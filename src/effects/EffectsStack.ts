export class EffectsStack {
    static #instance: EffectsStack | null = null;
    #effects: Set<Function> | null = null;
    #requestAnimationFrameID: number | null = null;
    #batchEffects: Set<Function> | null = null;
    #batch = 0;

    constructor() {
        if (EffectsStack.#instance) {
            return EffectsStack.#instance;
        }

        EffectsStack.#instance = this;
        this.#effects = new Set();   
        this.#batchEffects = new Set();        
    }

    beginBatch() {
        this.#batch++;
    }

    endBatch() {
        if (this.#batch === 0) {
            return;
        }
        this.#batch--;

        if (this.#batch === 0) {
            [...(this.#batchEffects ?? [])].forEach(effect => this.addStackEffect(effect));
            this.#batchEffects?.clear();
        }
    }

    addStackEffect(effect: Function) {
        this.#effects?.add(effect);

        if (this.#requestAnimationFrameID !== null) {
            return;
        }

        this.#requestAnimationFrameID = requestAnimationFrame(this.#flushEffects);
    }

    addBatchEffect(effect: Function) {
        this.#batchEffects?.add(effect);
    }

    addEffect = (effect: Function) => {
        if (typeof effect !== "function") {
            return;
        }
        
        if (this.#batch > 0) {
            this.addBatchEffect(effect);
            return;
        }

        this.addStackEffect(effect);
    }

    #flushEffects = () => {
        const effectsToRun = [...(this.#effects ?? [])];
        if (!this.#effects) {
            return;
        }
        this.#effects.clear();
        this.#requestAnimationFrameID = null;

        effectsToRun.forEach(effect => effect());

        if (this.#effects.size > 0) {
            this.#requestAnimationFrameID = requestAnimationFrame(this.#flushEffects);
        }
    }

    
    static getInstance(): EffectsStack {
        if (!EffectsStack.#instance) {
            EffectsStack.#instance = new EffectsStack();
        }
        return EffectsStack.#instance;
    }

}