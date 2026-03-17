import { compose } from "./compose";
import { createEffect } from "../effects/createEffect";

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