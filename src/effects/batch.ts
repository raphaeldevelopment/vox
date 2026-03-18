import { EffectsStack } from "./EffectsStack"

export const batch = (callback: () => void) => {
    const effectsStack = EffectsStack.getInstance();

    try {
        effectsStack.beginBatch();
        callback();
    } finally {
        effectsStack.endBatch();
    }
}