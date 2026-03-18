class InputText {
    #node = null;

    constructor(node) {
        this.#node = node;
    }

    changeValue(value) {
        this.#node.value = `${value}`;
    }

    addChangeEvent(callback) {
        this.#node.addEventListener("input", (e) => {
            callback(e.target.value);
        });

    }
}

class InputCheckbox {
    #node = null;

    constructor(node) {
        this.#node = node;
    }

    changeValue(value) {
        this.#node.checked = Boolean(value);
    }

    addChangeEvent(callback) {
        this.#node.addEventListener("change", (e) => {
            callback(e.target.checked);
        });
    }
}

class InputRadioGroup {
    #container = null;
    #nodes = [];

    constructor(container) {
        this.#container = container;
        this.#nodes = [...container.querySelectorAll('input[type="radio"]')];
    }

    changeValue(value) {
        this.#nodes.forEach((node) => {
            node.checked = node.value === value;
        });
    }

    addChangeEvent(callback) {
        this.#nodes.forEach((node) => {
            node.addEventListener("change", (e) => {
                if (e.target.checked) {
                    callback(e.target.value);
                }
            });
        });
    }

    getValue() {
        const checkedNode = this.#nodes.find(node => node.checked);
        return checkedNode ? checkedNode.value : null;
    }
}

class InputSelect {
    #node = null;

    constructor(node) {
        this.#node = node;
    }

    changeValue(value) {
        this.#node.value = value;
    }

    addChangeEvent(callback) {
        this.#node.addEventListener("change", (e) => {
            callback(e.target.value);
        });
    }
}

export class InputField {
    static create(node) {
        const tag = node.tagName.toLowerCase();

        if (tag === "input") {
            const type = node.type.toLowerCase();

            switch (type) {
                case "checkbox":
                    return new InputCheckbox(node);

                default:
                    return new InputText(node);
            }
        }

        if (tag === "select") {
            return new InputSelect(node);
        }

        if (node.dataset.input === "radio-group") {
            return new InputRadioGroup(node);
        }

        throw new Error("Element not supported");
    }
}