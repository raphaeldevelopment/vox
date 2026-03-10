import { checkVariables } from "./checkVariables.js";
import { checkAttributes } from "./checkAttributes.js";
import { checkValue } from "./checkValue.js";
import { checkTemplates } from "./checkTemplates.js";
import { checkIf } from "./checkIf.js";

/**
 * Main call to run VOX
 */
export const voxMain = async () => {
    await checkTemplates();
    checkVariables();
    checkAttributes();
    checkValue();
    checkIf();
}
