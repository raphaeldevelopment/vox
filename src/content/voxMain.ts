import { checkForEach } from "./checkForEach";
import { checkVariables } from "./checkVariables";
import { checkAttributes } from "./checkAttributes";
import { checkValue } from "./checkValue";
import { checkTemplates } from "./checkTemplates";
import { addEvents } from "./addEvents";
import { checkIf } from "./checkIf";
import { checkContexts } from "./checkContexts";

const voxRestart = (parentNode?: HTMLElement) => {
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