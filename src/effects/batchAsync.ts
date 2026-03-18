import { EffectsStack } from "./EffectsStack"

export const batchAsync = async (callback: Function) => {
    const effectsStack = EffectsStack.getInstance();

    try {
        effectsStack.beginBatch();
        await callback();
    } finally {
        effectsStack.endBatch();
    }
}