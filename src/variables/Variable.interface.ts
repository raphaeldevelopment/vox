export type WatchCallback<T = unknown> = (value: T, previousValue?: T) => void;
export type Unsubscribe = () => void;