import { State } from "../state/State.js";
import { VariableRegistry } from "../variables/VariableRegistry.js";
import { voxLog } from "./voxLog.js";

export function voxDebug() {
    voxLog("STATE", State.getInstance());
    voxLog("VARIABLES", VariableRegistry.getInstance());
}