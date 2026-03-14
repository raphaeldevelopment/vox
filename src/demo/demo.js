import { createVariable } from "../variables/createVariable.js";
import { createEffect } from "../effects/createEffect.js";

const output = document.querySelector("#output");

const log = (title, value) => {
    const line = document.createElement("div");
    line.innerHTML = `<strong>${title}</strong>: ${value}`;
    output.appendChild(line);
};

const section = title => {
    const el = document.createElement("h2");
    el.textContent = title;
    output.appendChild(el);
};

const separator = () => {
    const hr = document.createElement("hr");
    output.appendChild(hr);
};

const read = variable => variable.getValue();
const write = callback => value => callback.call(value);

section("1. Basic variable");

const [count, setCount] = createVariable(0);

createEffect((newValue, oldValue) => {
    log("count changed", `${oldValue} → ${newValue}`);
}, [count]);

log("initial count", read(count));

write(setCount)(1);
write(setCount)(2);
write(setCount)(2);

log("final count", read(count));

separator();

section("2. Derived variable from dependencies");

const [price, setPrice] = createVariable(100);
const [quantity, setQuantity] = createVariable(2);

const [total] = createVariable(
    () => read(price) * read(quantity),
    [price, quantity]
);

createEffect((newValue, oldValue) => {
    log("total changed", `${oldValue} → ${newValue}`);
}, )

log("initial price", read(price));
log("initial quantity", read(quantity));
log("initial total", read(total));

write(setPrice)(150);
log("total after price=150", read(total));

write(setQuantity)(3);
log("total after quantity=3", read(total));

separator();

section("3. Replace derived variable with direct value");

const [, setTotal] = createVariable(0); // dummy example removed below

const [score, setScore] = createVariable(10);
const [bonus, setBonus] = createVariable(5);

const [finalScore, setFinalScore] = createVariable(
    () => read(score) + read(bonus),
    [score, bonus]
);

finalScore.addEvent((newValue, oldValue) => {
    log("finalScore changed", `${oldValue} → ${newValue}`);
});

log("initial finalScore", read(finalScore));

write(setScore)(20);
log("after score=20", read(finalScore));

write(setFinalScore)(999);
log("after setFinalScore(999)", read(finalScore));

write(setBonus)(100);
log("after bonus=100 (should stay 999)", read(finalScore));

separator();

section("4. Replace direct value with a new derived formula");

const [a, setA] = createVariable(1);
const [b, setB] = createVariable(2);
const [result, setResult] = createVariable(0);

result.addEvent((newValue, oldValue) => {
    log("result changed", `${oldValue} → ${newValue}`);
});

log("initial result", read(result));

write(setResult)(() => read(a) + read(b), [a, b]);
log("result after derived formula a+b", read(result));

write(setA)(10);
log("result after a=10", read(result));

write(setB)(20);
log("result after b=20", read(result));

separator();

section("5. Change derived formula");

const [x, setX] = createVariable(2);
const [y, setY] = createVariable(3);

const [computedValue, setComputedValue] = createVariable(
    () => read(x) * read(y),
    [x, y]
);

computedValue.addEvent((newValue, oldValue) => {
    log("computedValue changed", `${oldValue} → ${newValue}`);
});

log("initial computedValue", read(computedValue));

write(setX)(4);
log("after x=4", read(computedValue));

write(setComputedValue)(() => read(x) - read(y), [x, y]);
log("after formula changed to x-y", read(computedValue));

write(setY)(1);
log("after y=1", read(computedValue));

separator();

section("6. Function without dependencies = one-time evaluation");

const [plainFunctionValue, setPlainFunctionValue] = createVariable(0);

write(setPlainFunctionValue)(() => 42);
log("plainFunctionValue", read(plainFunctionValue));

separator();

section("7. Visual live binding");

const liveCount = document.querySelector("#live-count");
const liveDouble = document.querySelector("#live-double");
const incButton = document.querySelector("#increment");
const resetButton = document.querySelector("#reset");

const [uiCount, setUiCount] = createVariable(0);
const [uiDouble] = createVariable(() => read(uiCount) * 2, [uiCount]);

const renderLive = () => {
    liveCount.textContent = String(read(uiCount));
    liveDouble.textContent = String(read(uiDouble));
};

uiCount.addEvent(() => renderLive());
uiDouble.addEvent(() => renderLive());

renderLive();

incButton.addEventListener("click", () => {
    write(setUiCount)(read(uiCount) + 1);
});

resetButton.addEventListener("click", () => {
    write(setUiCount)(0);
});