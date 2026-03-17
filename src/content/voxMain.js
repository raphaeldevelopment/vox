import { checkForEach } from "./checkForEach.js";
import { checkVariables } from "./checkVariables.js";
import { checkAttributes } from "./checkAttributes.js";
import { checkValue } from "./checkValue.js";
import { checkTemplates } from "./checkTemplates.js";
import { addEvents } from "./addEvents.js";
import { checkIf } from "./checkIf.js";
import { checkContexts } from "./checkContexts.js";

const voxRestart = (parentNode) => {
    checkVariables(parentNode);
    checkAttributes(parentNode);
    checkValue(parentNode);
    addEvents(parentNode);
    checkIf(parentNode);
}
/**
 * Main call to run VOX
 */
export const voxMain = async () => {
    await checkTemplates();
    checkContexts();
    checkForEach(voxRestart);
    voxRestart();
}