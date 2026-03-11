import { State } from "../state/State.js";
import { VariableRegistry } from "../utils/VariableRegistry.js";
import { voxLog } from "./voxLog.js";

export function voxDebug() {
    voxLog("STATE", State.getInstance());
    voxLog("VARIABLES", VariableRegistry.getInstance());
}