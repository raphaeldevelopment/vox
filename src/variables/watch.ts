import { compose } from "./compose";
import { createEffect } from "../effects/createEffect";
import { Variable } from "./Variable";

export const watch = (dep: Variable<any> | Function, callback: Function) => {
    let variable: Variable<any>;
    if (typeof dep === "function") {
        variable = compose(dep);
    } else {
        variable = dep;
    }

    if (!variable) {
        return;
    }

    return createEffect(callback, [variable]);
}