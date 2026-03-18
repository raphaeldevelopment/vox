export interface ParseVariableKeyInterface {
    type: string; 
    index: string | number;
}

export interface ParseVariableInterface {
    isState: boolean;
    keys: Array<ParseVariableKeyInterface>;
}

