import { EffectsStack } from "./EffectsStack"

export const batch = (callback: Function) => {
    const effectsStack = EffectsStack.getInstance();

    try {
        effectsStack.beginBatch();
        callback();
    } finally {
        effectsStack.endBatch();
    }
}