import { EffectsStack } from "./EffectsStack.js"

export const batchAsync = async callback => {
    const effectsStack = EffectsStack.getInstance();

    try {
        effectsStack.beginBatch();
        await callback();
    } finally {
        effectsStack.endBatch();
    }
}