import { EffectsStack } from "./EffectsStack.js"

export const batch = callback => {
    const effectsStack = EffectsStack.getInstance();

    try {
        effectsStack.beginBatch();
        callback();
    } finally {
        effectsStack.endBatch();
    }
}