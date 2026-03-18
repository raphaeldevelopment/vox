import { compose } from "./compose";
import { createEffect } from "../effects/createEffect";
import { Variable } from "./Variable";
import { WatchSource } from "./watch.interface";
import { WatchCallback } from "./Variable.interface";

export function watch<T>(dep: WatchSource<T>, callback: WatchCallback<T>) {
  const variable: Variable<T> =
    typeof dep === "function" ? compose(dep) : dep;

  if (!variable) {
    return () => {};
  }

  let previousValue: T | undefined = undefined;
  let initialized = false;

  return createEffect(() => {
    const value = variable.getValue();

    if (initialized) {
      callback(value, previousValue);
    }

    previousValue = value;
    initialized = true;
  }, [variable]);
}