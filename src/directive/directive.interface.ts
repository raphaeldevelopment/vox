import { CallbackRegistry } from "../callbacks/CallbackRegistry";
import { ElementObserver } from "../dom/ElementObserver";
import { State } from "../state/State";
import { VariableRegistry } from "../variables/VariableRegistry";

export interface DirectiveLogic {
    variableRegistry: VariableRegistry;
    callbackRegistry: CallbackRegistry;
    state: State;
    elementObserver: ElementObserver;
    value: string;
    node: HTMLElement;
    guard: (node: HTMLElement, init: boolean, cleanup: Function, variableName?: string) => void;
    voxRestart: (parent: HTMLElement) => void;
}

export type Directive = (opts: DirectiveLogic) => void;

export interface DirectiveOptions {
    name: string;
    key: string;
    selector: string | ((parentNode?: HTMLElement) => Array<HTMLElement | Element>); 
    onBefore?: () => void;
    logic: Directive;
}