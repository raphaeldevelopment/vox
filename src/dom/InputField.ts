class InputText {
    #node: HTMLInputElement | null = null;

    constructor(node: HTMLInputElement) {
        this.#node = node;
    }

    changeValue(value: string) {
        if (!this.#node) {
            return;
        }
        this.#node.value = `${value}`;
    }

    addChangeEvent(callback: Function) {
        if (!this.#node) {
            return;
        }
        this.#node.addEventListener("input", (e) => {
            callback((e.target as HTMLInputElement).value || "");
        });

    }
}

export class InputCheckbox {
    #node: HTMLInputElement | null = null;

    constructor(node: HTMLInputElement) {
        this.#node = node;
    }

    changeValue(value: boolean) {
        if (!this.#node) {
            return;
        }
        this.#node.checked = Boolean(value);
    }

    addChangeEvent(callback: Function) {
        if (!this.#node) {
            return;
        }
        this.#node.addEventListener("change", (e) => {
            callback((e.target as HTMLInputElement).checked);
        });
    }
}

class InputRadioGroup {
    #nodes: Array<HTMLInputElement> = [];

    constructor(container: HTMLDivElement) {
        this.#nodes = [...container.querySelectorAll('input[type="radio"]')] as Array<HTMLInputElement>;
    }

    changeValue(value: string) {
        this.#nodes.forEach((node) => {
            node.checked = node.value === value;
        });
    }

    addChangeEvent(callback: Function) {
        this.#nodes.forEach((node) => {
            node.addEventListener("change", (e) => {
                if ((e.target as HTMLInputElement).checked) {
                    callback((e.target as HTMLInputElement).value);
                }
            });
        });
    }

    getValue(): string | null {
        const checkedNode = this.#nodes.find(node => node.checked);
        return checkedNode ? checkedNode.value : null;
    }
}

class InputSelect {
    #node: HTMLInputElement | null = null;

    constructor(node: HTMLInputElement) {
        this.#node = node;
    }

    changeValue(value: string) {
        if (!this.#node) {
            return;
        }
        this.#node.value = value;
    }

    addChangeEvent(callback: Function) {        
        if (!this.#node) {
            return;
        }

        this.#node.addEventListener("change", (e) => {
            callback((e.target as HTMLInputElement).value);
        });
    }
}

export class InputField {
    static create(node: HTMLInputElement) {
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