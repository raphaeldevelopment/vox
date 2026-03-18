import { EffectsStack } from "./EffectsStack"

export const batchAsync = async (callback: () => void) => {
    const effectsStack = EffectsStack.getInstance();

    try {
        effectsStack.beginBatch();
        await callback();
    } finally {
        effectsStack.endBatch();
    }
}