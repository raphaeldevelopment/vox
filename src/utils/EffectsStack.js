export class EffectsStack {
    static #instance = null;
    #effects = null;
    requestAnimationFrameID = 0;

    constructor() {
        if (EffectsStack.#instance) {
            return EffectsStack.#instance;
        }

        this.#effects = new Set();        
    }

    addEffect = effect => {
        if (typeof effect !== "function") {
            return;
        }
        
        this.#effects.add(effect);

        if (this.requestAnimationFrameID) {
            return;
        }

        this.requestAnimationFrameID = requestAnimationFrame(() => {
            const effectsToRun = [...this.#effects];
            this.#effects.clear();
            this.requestAnimationFrameID = 0;

            effectsToRun.forEach(effect => effect());
        })
    }

    
    static getInstance() {
        if (!EffectsStack.#instance) {
            EffectsStack.#instance = new EffectsStack();
        }
        return EffectsStack.#instance;
    }

}