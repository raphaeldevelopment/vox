import { getNodeIdentifier } from "./getNodeIdentifier";

export const guardNode = (node: HTMLElement, key: string, value: string, init: boolean, cleanup: Function = () => {}) => {
    if (init && node.dataset[key]) {
        if (node.dataset[key] === value) {
            throw new Error(`${getNodeIdentifier(node)} - ${key} is already initiated`);
        }
        cleanup();
    }

    node.dataset[key] = value;
}