// demo/demo.js
import { createVariable } from "../variables/createVariable.js";
import { createEffect } from "../effects/createEffect.js";
import { voxMain } from "../content/voxMain.js";
import { State } from "../state/State.js";
import { VariableRegistry } from "../variables/VariableRegistry.js";
import { CallbackRegistry } from "../callbacks/CallbackRegistry.js";
import { voxDebug } from "../debug/voxDebug.js";

const variableRegistry = VariableRegistry.getInstance();
const callbackRegistry = CallbackRegistry.getInstance();
const state = State.getInstance();

/* ---------------------------
 * Persistent state bootstrap
 * --------------------------- */
if (!state.has("profile")) {
  state.create("profile");
}

if (!state.has("profile", "savedName")) {
  state.addVariable("profile", "savedName", "Ana");
}

if (!state.has("profile", "visits")) {
  state.addVariable("profile", "visits", 0);
}

console.log(state);

const profileState = state.get("profile");
profileState.visits = state.get("profile", "visits").getValue() + 1;

/* ---------------------------
 * Variables
 * --------------------------- */
const [count, setCount] = createVariable(0);
const [name, setName] = createVariable("Vox User");
const [showDetails, setShowDetails] = createVariable(true);
const [themeName, setThemeName] = createVariable("ocean");
const [tags, setTags] = createVariable(["reactive", "dom-first", "tiny"]);
const [doubleCount] = createVariable(() => count.getValue() * 2, [count]);

/* ---------------------------
 * Registries
 * --------------------------- */
variableRegistry.set("count", count);
variableRegistry.set("name", name);
variableRegistry.set("showDetails", showDetails);
variableRegistry.set("themeName", themeName);
variableRegistry.set("tags", tags);
variableRegistry.set("doubleCount", doubleCount);

// vox-value expects the same key to exist in CallbackRegistry
callbackRegistry.set("name", setName);

/* ---------------------------
 * Effect log
 * --------------------------- */
const effectLogNode = document.getElementById("effect-log");
const effectLog = [];

const pushLog = (message) => {
  effectLog.unshift(`[${new Date().toLocaleTimeString()}] ${message}`);
  effectLog.splice(10);
  effectLogNode.innerHTML = effectLog.map((entry) => `<li>${entry}</li>`).join("");
};

pushLog("Demo booted");

createEffect(() => {
  pushLog(`count changed to ${count.getValue()}`);
}, [count]);

createEffect(() => {
  pushLog(`name changed to "${name.getValue()}"`);
}, [name]);

createEffect(() => {
  pushLog(`showDetails is now ${showDetails.getValue()}`);
}, [showDetails]);

createEffect(() => {
  pushLog(`theme switched to ${themeName.getValue()}`);
}, [themeName]);

createEffect(() => {
  pushLog(`tags updated: ${tags.getValue().join(", ")}`);
}, [tags]);

/* ---------------------------
 * Callbacks / Events
 * --------------------------- */
const increment = () => setCount(count.getValue() + 1);
const decrement = () => setCount(count.getValue() - 1);
const resetCounter = () => setCount(0);

const toggleDetails = () => setShowDetails(!showDetails.getValue());

const toggleTheme = () => {
  setThemeName(themeName.getValue() === "ocean" ? "forest" : "ocean");
};

const clearName = () => setName("");

const saveNameToState = () => {
  profileState.savedName = name.getValue().trim() || "Anonymous";
  pushLog(`saved "${profileState.savedName}" to persistent state`);
};

const incrementVisits = () => {
  profileState.visits = state.get("profile", "visits").getValue() + 1;
};

const resetVisits = () => {
  profileState.visits = 0;
};

const addTag = () => {
  const next = [...tags.getValue(), `tag-${tags.getValue().length + 1}`];
  setTags(next);
};

const removeLastTag = () => {
  const next = [...tags.getValue()];
  next.pop();
  setTags(next);
};

const debugApp = () => {
  voxDebug();
  pushLog("voxDebug() called - check console");
};

callbackRegistry.set("increment", increment);
callbackRegistry.set("decrement", decrement);
callbackRegistry.set("resetCounter", resetCounter);
callbackRegistry.set("toggleDetails", toggleDetails);
callbackRegistry.set("toggleTheme", toggleTheme);
callbackRegistry.set("clearName", clearName);
callbackRegistry.set("saveNameToState", saveNameToState);
callbackRegistry.set("incrementVisits", incrementVisits);
callbackRegistry.set("resetVisits", resetVisits);
callbackRegistry.set("addTag", addTag);
callbackRegistry.set("removeLastTag", removeLastTag);
callbackRegistry.set("debugApp", debugApp);

/* ---------------------------
 * Template demo
 * --------------------------- */
const templateHtml = `
  <div>
    <strong>Template preview</strong>
    <p style="margin:8px 0 0;">
      Hello <b>{{ name }}</b>, current count is <b>{{ count }}</b>
      and double count is <b>{{ doubleCount }}</b>.
    </p>
  </div>
`;

const templateUrl = URL.createObjectURL(
  new Blob([templateHtml], { type: "text/html" })
);

document
  .getElementById("template-slot")
  .setAttribute("vox-template", templateUrl);

/* ---------------------------
 * Start Vox
 * --------------------------- */
voxMain();