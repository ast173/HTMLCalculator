console.log("==================== SURFACE ====================");

import { evaluate, isFunction } from "./deep.js";
import { VALID_FUNCTIONS, VALID_CONSTANTS, VALID_FUNCTIONS2,
    cToVisual, funcTree } from "./util.js";
console.log("Imported items from \"./deep.js\"");
console.log(`Test 3.1:\n${evaluate}`);
console.log("Imported items from \"./util.js\"");
console.log(`Test 3.2:\n${cToVisual}`);

const input = document.getElementById("input");
const output = document.getElementById("output");
let stack = [];
let ans = 0;
let shiftEnabled = false;
export { ans }; // to "./deep.js"

// evaluateHTML: void -> void
function evaluateHTML() {
    output.value = evaluate(stack);
    ans = parseFloat(output.value);
    pointer = 0;
}

// addToInput: String -> void
function addToInput(c) {
    output.value = "";

    if (pointer === 0) {
        stack.push(c);
    } else {
        let start = stack.slice(0, pointer);
        start.push(c)
        let end = stack.slice(pointer);
        stack = start.concat(end);
    }

    if (cToVisual.has(c)) {
        redrawInputText();
    } else {
        throw new Error("Error: " + c + " is not in hashmap");
    }
}

// redrawInputText: void -> void
function redrawInputText() {
    input.value = stack.reduce((acc, c) => acc + cToVisual.get(c), "");
}

// addConstToInput: String -> void
function addConstToInput(c) {
    addToInput(c);
}

// addFuncToInput: String -> void
function addFuncToInput(c) {
    output.value = "";

    if (pointer === 0) {
        stack.push(c);
        stack.push("(");
    } else {
        let start = stack.slice(0, pointer);
        start.push(c);
        start.push("(");
        let end = stack.slice(pointer);
        stack = start.concat(end);
    }

    if (cToVisual.has(c)) {
        redrawInputText();
    } else {
        throw new Error("Error: " + c + " is not in hashmap");
    }
}

// addFunc2ToInput: String -> void
function addFunc2ToInput(c) {
    // TODO: finish this
}

// clearInput: void -> void
function clearInput() {
    output.value = "";
    input.value = "";
    stack.length = 0;
    pointer = 0;
    path.length = 0;
}

// deleteInput: void -> void
function deleteInput() {
    output.value = "";

    if (pointer === -stack.length) return;

    function deleteC() {
        let c = stack.splice(pointer - 1, 1)[0];
        redrawInputText();
        return c;
    }

    let justDeleted = deleteC();
    if (justDeleted === "(" && isFunction(stack.at(pointer - 1))) deleteC();
}

// shiftToggle: void -> void
function shiftToggle() {
    shiftEnabled = !shiftEnabled;
    document.documentElement.classList.toggle("shift-enabled", shiftEnabled);
}

document.querySelectorAll(".shiftOff").forEach(btn => {
    btn.classList.toggle("hidden", shiftEnabled);
});

window.evaluateHTML = evaluateHTML;
window.addToInput = addToInput;
window.addConstToInput = addConstToInput;
window.addFuncToInput = addFuncToInput;
window.addFunc2ToInput = addFunc2ToInput;
window.clearInput = clearInput;
window.deleteInput = deleteInput;
window.shiftToggle = shiftToggle;

// ==================== NAVIGATION ====================
let pointer = 0;
// moveLeft: void -> void
function moveLeft() {
    output.value = "";
    if (pointer <= -stack.length) return;
    pointer--;
}

// moveRight: void -> void
function moveRight() {
    output.value = "";
    if (pointer >= 0) return;
    pointer++;
}

// moveStart: void -> void
function moveStart() {
    output.value = "";
    pointer = -stack.length;
}

// moveEnd: void -> void
function moveEnd() {
    output.value = "";
    pointer = 0;
}

window.moveLeft = moveLeft;
window.moveRight = moveRight;
window.moveStart = moveStart;
window.moveEnd = moveEnd;

// ==================== KEYBOARD INPUTS ====================
let path = [];
document.addEventListener("keydown", e => {
    let key = e.key;

    path.push(key.toLowerCase());
    let node = getFurthestNode(funcTree, [...path]);

    if (node instanceof Map && node.has("end")) {
        let c = path.join("");
        if (VALID_FUNCTIONS.includes(c)) {
            addFuncToInput(c);
        } else if (VALID_CONSTANTS.includes(c)) {
            addConstToInput(c);
        } else {
            throw Error(`Error: '${c}' is neither a function nor a constant`);
        }
        path.length = 0;
    } else if (node === false) {
        path.length = 0;
        if (funcTree.has(key)) {
            path.push(key);
        }
    }

    // getFurthestNode: Tree -> Tree | false
    function getFurthestNode(map, path) {
        if (path.length === 0) return map;
        if (!map.has(path[0])) return false;
        return getFurthestNode(map.get(path[0]), path.slice(1));
    }

    if (/^[0-9.+\-*/^()]$/.test(key)) {
        addToInput(key);
    } else if (key === "Enter" || key === "=") {
        e.preventDefault();
        evaluateHTML();
    } else if (key === "Backspace" || key === "Delete") {
        deleteInput();
    } else if (key === "Escape") {
        clearInput();
    } else if (key === "E") {
        addToInput("E");
    } else if (key === "x" || key === "X") {
        addToInput("*");
    } else if (key === "|") {
        addFuncToInput("abs");
    } else if (key === "!") {
        addToInput("!");
    } else if (key === "%") {
        addToInput("%");
    } else if (key === "ArrowLeft") {
        moveLeft();
    } else if (key === "ArrowRight") {
        moveRight();
    } else if (key === "Home") {
        e.preventDefault();
        moveStart();
    } else if (key === "End") {
        e.preventDefault();
        moveEnd();
    }
});