export const getNodeIdentifier = node => {
    let selector = node.tagName.toLowerCase();

    if (node.id) {
        selector += `#${node.id}`;
    }

    if (node.classList.length) {
        selector += "." + [...node.classList].join(".");
    }

    return selector;
}