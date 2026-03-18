import { Variable } from "./Variable";

export const untrack = (callback: Function) => {
    const previousCollector = Variable.getCollector();

    try {
        Variable.setCollector(null);
        return callback();
    } finally {
        Variable.setCollector(previousCollector);
    }
}