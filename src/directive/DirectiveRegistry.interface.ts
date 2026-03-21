import { DirectiveOptions } from "./directive.interface";

export interface DirectiveElement {
    directiveSettings: DirectiveOptions;
    priority: number;
    repeatable: boolean;
}