import { evaluate, isFunction, VALID_FUNCTIONS, VALID_CONSTANTS } from "./deep.js";
export { evaluateHTML, addToInput, addConstToInput, addFuncToInput, addFunc2ToInput,
    clearInput, deleteInput, shiftToggle, moveLeft, moveRight, moveStart, moveEnd,
    ans, varMap };

// TODO: make it so sin(60)=sqrt(3)/2 exactly
// TODO: also add pi/3 and fractions
// TODO: make a set button for variables
// TODO: store variable values to local storage
// TODO: add functions that take 2 arguments
// TODO: on mobile make the calculator take up the full screen and make it focus off the button after a click
const input = document.getElementById("input");
const output = document.getElementById("output");
let stack = [];
let ans = 0;
let varMap = new Map([
    ["va", 0],
    ["vb", 0],
    ["vc", 0],
    ["vd", 0],
    ["ve", 0],
    ["vf", 0],
    ["vg", 0],
    ["vy", 0],
    ["vz", 0],
]);

let cToVisual = new Map([
    // normal no change
    ["0", "0"],
    ["1", "1"],
    ["2", "2"],
    ["3", "3"],
    ["4", "4"],
    ["5", "5"],
    ["6", "6"],
    ["7", "7"],
    ["8", "8"],
    ["9", "9"],
    [".", "."],
    ["+", "+"],
    ["-", "-"],
    ["/", "/"],
    ["^", "^"],
    ["!", "!"],
    ["%", "%"],
    ["(", "("],
    [")", ")"],

    // normal
    ["*", "×"],
    ["E", "×10^"],
    ["sqr", "²"],
    ["cube", "³"],
    ["rec", "⁻¹"],
    ["exp", "e^"],
    ["expt10", "10^"],

    // constants
    ["pi", "π"],
    ["e", "e"],
    ["phi", "Φ"],
    ["ans", "ANS"],

    // functions
    ["sqrt", "√"],
    ["cbrt", "³√"],
    ["sin", "sin"],
    ["cos", "cos"],
    ["tan", "tan"],
    ["asin", "sin⁻¹"],
    ["acos", "cos⁻¹"],
    ["atan", "tan⁻¹"],
    ["ln", "ln"],
    ["lg", "log"],
    ["abs", "abs"],

    // complex functions
    ["root", "root"],
    ["log", "log"],
]);

// variables
for (let i = 0; i < 26; i++) {
    let lowercase = String.fromCharCode(97 + i);
    cToVisual.set(`v${lowercase}`, lowercase.toUpperCase());
}

// for (let i of [0x03B1, 0x03B2, 0x03B3, 0x0393, 0x0394, 0x03B4, 0x03B5, 0x03B6, 0x03B8, 0x03BB, 0x03BC, 0x03C3, 0x03A3, 0x03C4, 0x03C9, 0x03A9]) {
//     let greekChar = String.fromCharCode(i);
//     cToVisual.set(`var_${greekChar}`, greekChar);
// }

function evaluateHTML() {
    output.value = evaluate(stack);
    ans = parseFloat(output.value);
    pointer = 0;
}

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

function redrawInputText() {
    input.value = stack.reduce((acc, c) => acc + cToVisual.get(c), "");
}

function addConstToInput(c) {
    addToInput(c);
}

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

function addFunc2ToInput(c) {
    // TODO: finish this
}

function clearInput() {
    output.value = "";
    input.value = "";
    stack.length = 0;
    pointer = 0;
    path.length = 0;
}

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

let shiftEnabled = false;
const shiftButton = document.getElementById("shift");
function shiftToggle() {
    shiftEnabled = !shiftEnabled;
    document.documentElement.classList.toggle("shift-enabled", shiftEnabled);
}

shiftButton.onclick = () => shiftToggle()
document.querySelectorAll(".shiftOff").forEach(btn => {
    btn.classList.toggle("hidden", shiftEnabled);
});

// navigation
let pointer = 0;
function moveLeft() {
    output.value = "";
    if (pointer <= -stack.length) return;
    pointer--;
}

function moveRight() {
    output.value = "";
    if (pointer >= 0) return;
    pointer++;
}

function moveStart() {
    output.value = "";
    pointer = -stack.length;
}

function moveEnd() {
    output.value = "";
    pointer = 0;
}

window.evaluateHTML = evaluateHTML;
window.addToInput = addToInput;
window.addConstToInput = addConstToInput;
window.addFuncToInput = addFuncToInput;
window.addFunc2ToInput = addFunc2ToInput;
window.clearInput = clearInput;
window.deleteInput = deleteInput;
window.shiftToggle = shiftToggle;
window.moveLeft = moveLeft;
window.moveRight = moveRight;
window.moveStart = moveStart;
window.moveEnd = moveEnd;

let path = [];
const END = ["end", true]
let funcTree = new Map([
    ["a", new Map([
        ["b", new Map([
            ["s", new Map([END])]
        ])],
        ["c", new Map([
            ["o", new Map([
                ["s", new Map([END])]
            ])]
        ])],
        ["n", new Map([
            ["s", new Map([END])]
        ])],
        ["s", new Map([
            ["i", new Map([
                ["n", new Map([END])]
            ])]
        ])],
        ["t", new Map([
            ["a", new Map([
                ["n", new Map([END])]
            ])]
        ])],
    ])],
    ["c", new Map([
        ["b", new Map([
            ["r", new Map([
                ["t", new Map([END])]
            ])]
        ])],
        ["o", new Map([
            ["s", new Map([END])]
        ])],
    ])],
    ["e", new Map([END])],
    ["l", new Map([
        ["g", new Map([END])],
        ["n", new Map([END])],
        ["o", new Map([
            ["g", new Map([END])]
        ])],
    ])],
    ["p", new Map([
        ["i", new Map([END])],
        ["h", new Map([
            ["i", new Map([END])]
        ])],
    ])],
    ["s", new Map([
        ["i", new Map([
            ["n", new Map([END])]
        ])],
        ["q", new Map([
            ["r", new Map([
                ["t", new Map([END])],
            ])]
        ])],
    ])],
    ["t", new Map([
        ["a", new Map([
            ["n", new Map([END])]
        ])]
    ])],
    ["v", new Map([
        ["a", new Map([END])],
        ["b", new Map([END])],
        ["c", new Map([END])],
        ["d", new Map([END])],
        ["e", new Map([END])],
        ["f", new Map([END])],
        ["g", new Map([END])],
        ["y", new Map([END])],
        ["z", new Map([END])],
    ])],
]);

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