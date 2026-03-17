import { Variable } from "./Variable.js";

export const untrack = callback => {
    const previousCollector = Variable.getCollector();

    try {
        Variable.setCollector(null);
        return callback();
    } finally {
        Variable.setCollector(previousCollector);
    }
}