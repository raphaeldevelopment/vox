import { directive } from "./directive";
import { DirectiveOptions } from "./directive.interface";
import { DirectiveElement } from "./DirectiveRegistry.interface";

export class DirectiveRegistry {
    static #instance: DirectiveRegistry;
    #directives: Array<DirectiveElement> = new Array();

    constructor() {
        if (DirectiveRegistry.#instance) {
            return DirectiveRegistry.#instance;
        }

        DirectiveRegistry.#instance = this;
    }

    set(directiveSettings: DirectiveOptions, repeatable = false, priority = 0) {
        this.#directives.push({
            directiveSettings,
            priority,
            repeatable
        });
    }

    execute(parentNode?: HTMLElement) {
        this.#directives
            .filter((dir: DirectiveElement) => !dir.repeatable)
            .sort((dir1: DirectiveElement, dir2: DirectiveElement) => dir2.priority - dir1.priority)
            .forEach((dir: DirectiveElement) => {
                directive(dir.directiveSettings, parentNode);
            })
    }

    restart(parentNode?: HTMLElement) {
        this.#directives
            .filter((dir: DirectiveElement) => dir.repeatable)
            .sort((dir1: DirectiveElement, dir2: DirectiveElement) => dir2.priority - dir1.priority)
            .forEach((dir: DirectiveElement) => {
                directive(dir.directiveSettings, parentNode);
            })
    }

    static getInstance(): DirectiveRegistry {
        if (!DirectiveRegistry.#instance) {
            DirectiveRegistry.#instance = new DirectiveRegistry();
        }
        return DirectiveRegistry.#instance;
    }
}