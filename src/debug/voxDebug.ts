import { State } from "../state/State";
import { VariableRegistry } from "../variables/VariableRegistry";
import { voxLog } from "./voxLog";

export function voxDebug() {
    voxLog("STATE", State.getInstance());
    voxLog("VARIABLES", VariableRegistry.getInstance());
}