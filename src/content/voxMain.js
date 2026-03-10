import { checkVariables } from "./checkVariables.js";
import { checkAttributes } from "./checkAttributes.js";
import { checkValue } from "./checkValue.js";

/**
 * Main call to run VOX
 */
export const voxMain = () => {
    checkVariables();
    checkAttributes();
    checkValue();
}
