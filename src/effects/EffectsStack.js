export class EffectsStack {
    static #instance = null;
    #effects = null;
    #requestAnimationFrameID = null;
    #batchEffects = null;
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
            [...this.#batchEffects].forEach(effect => this.addStackEffect(effect));
            this.#batchEffects.clear();
        }
    }

    addStackEffect(effect) {
        this.#effects.add(effect);

        if (this.#requestAnimationFrameID !== null) {
            return;
        }

        this.requestAnimationFrameID = requestAnimationFrame(this.#flushEffects);
    }

    addBatchEffect(effect) {
        this.#batchEffects.add(effect);
    }

    addEffect = effect => {
        if (typeof effect !== "function") {
            return;
        }
        
        if (this.#batch > 0) {
            return this.addBatchEffect(effect);
        }

        return this.addStackEffect(effect);
    }

    #flushEffects = () => {
        const effectsToRun = [...this.#effects];
        this.#effects.clear();
        this.#requestAnimationFrameID = null;

        effectsToRun.forEach(effect => effect());

        if (this.#effects.size > 0) {
            this.#requestAnimationFrameID = requestAnimationFrame(this.#flushEffects);
        }
    }

    
    static getInstance() {
        if (!EffectsStack.#instance) {
            EffectsStack.#instance = new EffectsStack();
        }
        return EffectsStack.#instance;
    }

}