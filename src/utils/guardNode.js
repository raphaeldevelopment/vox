import { getNodeIdentifier } from "./getNodeIdentifier.js";

export const guardNode = (node, key, value, init, cleanup) => {
    if (init && node.dataset[key]) {
        if (node.dataset[key] === value) {
            throw new Error(`${getNodeIdentifier(node)} - ${key} is already initiated`);
        }
        cleanup();
    }

    if (!node.isConnected) {
        throw new Error(`${getNodeIdentifier(node)} no longer exists`);
    }

    node.dataset[key] = value;
}