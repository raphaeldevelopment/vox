import { compose } from "./compose";
import { createEffect } from "../effects/createEffect";
import { Variable } from "./Variable";
import { WatchCallback, WatchSource } from "./watch.interface";

export function watch<T>(dep: WatchSource<T>, callback: WatchCallback<T>) {
    let variable: Variable<any>;
    if (typeof dep === "function") {
        variable = compose(dep);
    } else {
        variable = dep;
    }

    if (!variable) {
        return;
    }

    return createEffect(callback as () => T, [variable]);
}