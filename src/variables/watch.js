import { compose } from "./compose.js";
import { createEffect } from "../effects/createEffect.js";

export const watch = (dep, callback) => {
    let variable = dep;
    if (typeof dep === "function") {
        variable = compose(dep);
    }

    if (!variable) {
        return;
    }

    return createEffect(callback, [variable]);
}