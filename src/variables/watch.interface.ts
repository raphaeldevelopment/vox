import { Variable } from "./Variable";

export type WatchSource<T> = Variable<T> | (() => T);

export type WatchCallback<T> = () => void;