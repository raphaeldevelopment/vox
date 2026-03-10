import { createEffect } from "../src/effects/index.js";
import { createVariable } from "../src/variables/index.js";
import { voxMain, VariableRegistry } from "../src/content/index.js";
import { CallbackRegistry } from "../src/utils/CallbackRegistry.js";
import { Callback } from "../src/utils/Callback.js";


const [x, setX] = createVariable(0);
const [y, setY] = createVariable("t");
const [bool, setBool] = createVariable(false);
const [inpt, setInpt] = createVariable(15);
const [arr, setArr] = createVariable([1, "arr el", 3]);
const [index, setIndex] = createVariable(0);
const variableRegistry = VariableRegistry.getInstance();
const callbackRegistry = CallbackRegistry.getInstance();
variableRegistry.set("testing", x);
variableRegistry.set("test", y);
variableRegistry.set("inpt", inpt);
variableRegistry.set("bool", bool);
variableRegistry.set("arr", arr);
variableRegistry.set("index", index);


callbackRegistry.set("inpt", setInpt);
callbackRegistry.set("buttonClick", () => {
    setIndex(index + 1);
});

createEffect(() => {
    if ((x / 10) % 3 === 0) {
        setY(x * 2);
    }

    console.log(x); 
    if (x == 40) {
        setArr([]);
    }
    if (x == 90) {
        console.log("acum");
        setBool(true);
        setArr([1, 2, 3, 4]);
    }
}, [x]);


for (let i = 0; i < 10; i++)
    setTimeout(() => {
        setX(i * 10);
    }, i *1000)


voxMain();