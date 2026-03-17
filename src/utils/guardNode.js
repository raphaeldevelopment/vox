import { getNodeIdentifier } from "./getNodeIdentifier.js";

export const guardNode = (node, key, value, init, cleanup = () => {}) => {
    if (init && node.dataset[key]) {
        if (node.dataset[key] === value) {
            throw new Error(`${getNodeIdentifier(node)} - ${key} is already initiated`);
        }
        cleanup();
    }

    node.dataset[key] = value;
}