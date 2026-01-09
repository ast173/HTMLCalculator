// evaluate: Array[String...] -> Number | String
function evaluate(expression) {
    try {
        let res = tryEvaluate(expression);
        return Math.round(res * 1e12) / 1e12;
    } catch (e) {
        return e.message;
    }
}

// tryEvaluate: Array[String...] -> Number
function tryEvaluate(expression) {
    let values = [];
    let operators = [];

    // reduceExpression: void
    function reduceExpression() {
        let right = values.pop();
        let left = values.pop();
        let op = operators.pop();

        let reducedValue = applyOp(op, left, right);
        values.push(reducedValue);
    }

    if (expression.length === 0) throw Error("");

    for (let i = 0; i < expression.length; i++) {
        let c = expression[i];
        // let next = expression[i + 1]; // TODO: use these?
        // let before = expression[i + 1];

        if (c === " ") continue;

        if (isDigit(c) || c === ".") {
            let value = c;
            let hasDot = c === ".";

            while (i + 1 < expression.length && (isDigit(expression[i + 1]) || expression[i + 1] === ".")) {
                let newC = expression[i + 1];

                if (newC === ".") {
                    if (hasDot) throw Error("Error 2: Multiple decimal places");
                    else hasDot = true;
                }

                value += newC;
                i++;
            }

            if (value === ".") value = 0;

            values.push(parseFloat(value));
        } else if (c === "-" && (i === 0 || isOperator(expression[i - 1]) || expression[i - 1] === "(")) {
            values.push(0);
            operators.push("-");
        } else if (isOperator(c)) {
            while (validExpression(values, operators) && shouldDoReduction(operators.at(-1), c)) {
                reduceExpression();
            }
            operators.push(c);
        } else if (c === "(") {
            if (i !== 0 && !isOperator(expression[i - 1]) && expression[i - 1] !== ")") {
                operators.push("*");
            }
            if (isConstant(expression[i - 1])) {
                operators.push("*");
            }
            operators.push(c);
        } else if (c === ")") {
            while (validExpression(values, operators) && shouldDoReduction(operators.at(-1), c)) {
                reduceExpression();
            }
            operators.pop();
            if (i < expression.length - 1 && !isOperator(expression[i + 1])) {
                operators.push("*");
            }
            if (isConstant(expression[i + 1])) {
                operators.push("*");
            }
        }

        // constants
        else if (isConstant(c)) {
            if (i !== 0 && !isOperator(expression[i - 1]) && !["(", ")"].includes(expression[i - 1])) {
                operators.push("*");
            }

            if (c === "pi") {
                values.push(Math.PI);
            } else if (c === "e") {
                values.push(Math.E);
            } else if (c === "phi") {
                const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
                values.push(GOLDEN_RATIO);
            } else if (c === "ans") {
                values.push(ans);
            }

            if (i < expression.length - 1 && !isOperator(expression[i + 1]) && !["(", ")"].includes(expression[i - 1])) {
                operators.push("*");
            }
        }

        // functions that apply to items already on the stack
        else if (c === "%") {
            let n = values.pop()
            values.push(n / 100);
        } else if (c === "!") {
            let n = values.pop();

            if (!Number.isInteger(n) || n < 0) {
                throw new Error("Error 1: Factorial can only be applied to non negative integers");
            }

            let newVal = 1;
            for (let i = 2; i <= n; i++) {
                newVal *= i;
            }

            values.push(newVal);
        } else if (c === "sqr") {
            operators.push("^");
            values.push(2);
        } else if (c === "cube") {
            operators.push("^");
            values.push(3);
        } else if (c === "rec") {
            if (values.at(-1) === 0) throw new Error("Error 6: Reciprocal of 0 is undefined");
            operators.push("^");
            values.push(-1);
        } else if (c === "exp") {
            values.push(Math.E);
            operators.push("^");
        } else if (c === "expt10") {
            values.push(10);
            operators.push("^");
        }

        // functions
        else if (isFunction(c)) {
            if (i !== 0 && !isOperator(expression[i - 1])) {
                operators.push("*");
            }
            
            let depth = 1;
            // skip the opening bracket
            let j = i + 2;

            // index until ending bracket is reached or the end of the expression is reached
            while (j < expression.length) {
                let d = expression[j];

                if (d === "(") {
                    depth++;
                } else if (d === ")") {
                    depth--;
                }

                if (depth === 0) break;

                j++;
            }

            // evaluate the expression inside but not including the brackets (i + 2 to j - 1 inclusive)
            let subExpression = expression.slice(i + 2, j);
            let n = tryEvaluate(subExpression);
            // console.log("C and N: " + c + " " + n)

            values.push(applyFunction(c, n));

            // move the index i to j + 1. The for loop increments by one
            i = j;
        }

        // console.log("Index: " + i)
        // console.log(`Values: ${values}`)
        // console.log("Operators: " + operators)
        // console.log("==============================")
    }

    while (operators.at(-1) === "(") {
        operators.pop();
    } // TODO: this might ruin other stuff

    while (validExpression(values, operators)) {
        reduceExpression();
        // console.log("Index: End")
        // console.log(`Values: ${values}`)
        // console.log("Operators: " + operators)
        // console.log("==============================")
    }

    let res = values.pop();
    if (isNaN(res)) throw Error("Error 4: Result is NaN");
    return res;
}

// Let a Char be a String of length 1
// isDigit: Char -> Boolean
function isDigit(c) {
    return /^[0-9]$/.test(c);
}

// isOperator: Char -> Boolean
function isOperator(c) {
    return /^[+\-*/^E]$/.test(c);
}

// isFunction: String -> Boolean
const validFunctions = ["sqrt", "cbrt", "sin", "cos", "tan", "asin", "acos", "atan", "ln", "lg", "abs"];
function isFunction(c) {
    return validFunctions.includes(c);
}

// isConstant: String -> Boolean
const validConstants = ["pi", "e", "phi", "ans"];
function isConstant(c) {
    return validConstants.includes(c);
}

// validExpression: Array[Number...] Array[String...] -> Boolean
function validExpression(values, operators) {
    return operators.length >= 1 && values.length >= 2;
}

// shouldDoReduction: Char Char -> Boolean
function shouldDoReduction(top, current) {
    if (top === "(") return false;
    if (current === ")") return true;
    if (top === "^" && current === "^") return false;
    return getPriority(top) >= getPriority(current);
}

// getPriority: Char -> Number
// priority: (functions, %, !) > (^, E) > (*, /) > (+, -)
function getPriority(op) {
    switch (op) {
        case "^":
        case "E":
            return 2;
        case "*":
        case "/":
            return 1;
        case "+":
        case "-":
            return 0;
        default:
            throw new Error("Error 8: Unknown operator: " + op);
    }
}

// applyOp: Char Number Number -> Number
function applyOp(op, left, right) {
    switch (op) {
        case "+":
            return left + right;
        case "-":
            return left - right;
        case "*":
            return left * right;
        case "/":
            if (right === 0) {
                throw new Error("Error 0: Division by zero");
            }
            return left / right;
        case "^":
            return Math.pow(left, right);
        case "E":
            return left * Math.pow(10, right);
        default:
            throw new Error("Error 7: Unknown operator: " + op);
    }
}

// applyFunction: String Number -> Number
function applyFunction(func, n) {
    switch (func) {
        case "sqrt":
            if (n < 0) throw new Error("Error 9: " + n + " is outside of the domain for sqrt");
            return Math.sqrt(n)
        case "cbrt":
            return Math.cbrt(n);
        case "sin":
            return Math.sin(n * Math.PI / 180);
        case "cos":
            return Math.cos(n * Math.PI / 180);
        case "tan":
            if (Math.abs(Math.cos(n * Math.PI / 180)) < 1e-12) throw new Error("Error 5: 'tan(" + n + ")' is undefined");
            return Math.tan(n * Math.PI / 180);
        case "asin":
            if (n < -1 || 1 < n) throw new Error("Error 10: '" + n + "' is outside of the domain for asin");
            return Math.asin(n) * 180 / Math.PI;
        case "acos":
            if (n < -1 || 1 < n) throw new Error("Error 10: '" + n + "' is outside of the domain for acos");
            return Math.acos(n) * 180 / Math.PI;
        case "atan":
            return Math.atan(n) * 180 / Math.PI;
        case "ln":
            if (n <= 0) throw new Error("Error 9: '" + n + "' is outside of the domain for ln");
            return Math.log(n);
        case "lg":
            if (n <= 0) throw new Error("Error 9: '" + n + "' is outside of the domain for log10");
            return Math.log10(n);
        case "abs":
            return Math.abs(n);
    }
}

// order of operations
console.log(evaluate("1+3^3*4".split(""))); // 109
console.log(evaluate("1.4+2.6".split(""))); // 4
console.log(evaluate("0.1+0.2".split(""))); // 0.3
console.log(evaluate("0.1^2".split(""))); // 0.01
console.log(evaluate("2^3^2".split(""))); // 512
console.log(evaluate("(2^3)^2".split(""))); // 64
console.log(evaluate(".542".split(""))); // 0.542
console.log(evaluate("      1   +  2   +  3  * 4    - 5      ".split(""))); // 10
// errors
console.log(evaluate("1/0".split(""))); // Error 0
console.log(evaluate("1.1.3".split(""))); // Error 2
// pi and e
console.log(evaluate(["pi", "+", "e"])); // 5.860...
// negatives
console.log(evaluate("-90".split(""))); // -90
console.log(evaluate("----1")); // +1
console.log(evaluate("2*--5")); // +10
// percent
console.log(evaluate("100%".split(""))); // 1
console.log(evaluate("5001%".split(""))); // 50.01
console.log(evaluate("1.3%".split(""))); // 0.013
console.log(evaluate("10.00%*20".split(""))); // 2
console.log(evaluate("10.00%+20*4%".split(""))); // 0.9
console.log(evaluate("1%^4".split(""))); // 1e-8
// factorial
console.log(evaluate("0!".split(""))); // 1
console.log(evaluate("1!".split(""))); // 1
console.log(evaluate("5!".split(""))); // 120
console.log(evaluate("5!^3".split(""))); // 1728000
console.log(evaluate("2^4!".split(""))); // 16777216
// x10^
console.log(evaluate("2E5".split(""))); // 200000
console.log(evaluate("8E-3".split(""))); // 0.008
console.log(evaluate("-8E-3".split(""))); // -0.008
console.log(evaluate("2E-3^2".split(""))); // 2e-9
console.log(evaluate("0.1E2".split(""))); // 10
console.log(evaluate("-0.1E2".split(""))); // -10
// bracket multiplication
console.log(evaluate("2(3)".split(""))); // 6
console.log(evaluate("(4)9".split(""))); // 36
console.log(evaluate("-(5)(3)".split(""))); // -15
console.log(evaluate("-(5)(3)+5".split(""))); // -10
// sqr, cube, sqrt, cbrt, and trig functions
console.log(evaluate(["sqr", "(", "-", "4", ")"])); // 16
console.log(evaluate(["sqrt", "(", "9", ")"])); // 3
console.log(evaluate(["cube", "(", "3", ")"])); // 27
console.log(evaluate(["cbrt", "(", "-", "6", "4", ")"])); // -4
console.log(evaluate(["sin", "(", "9", "0", ")"])); // 1
console.log(evaluate(["sin", "(", "0", ")"])); // 0
console.log(evaluate(["sin", "(", "4", "5", ")"])); // 0.707...
console.log(evaluate(["cos", "(", "6", "0", ")"])); // 0.5
console.log(evaluate(["sin", "(", "6", "0", ")", "-", "cos", "(", "3", "0", ")"])); // 0
console.log(evaluate(["tan", "(", "9", "0", ")"])); // Error 5
console.log(evaluate(["-", "1", "-", "sin", "(", "9", "0", ")"])); // -2
console.log(evaluate(["sqrt", "(", "sqr", "(", "-", "1", "-", "sin", "(", "9", "0", ")", ")", "+", "5", ")"])); // 3
// lg and ln
console.log(evaluate(["lg", "(", "1", ")"])); // 0
console.log(evaluate(["ln", "(", "e", ")"])); // 1
console.log(evaluate(["ln", "(", "e", "*", "2", ")"])); // 1.693147...
// abs
console.log(evaluate(["abs", "(", "-", "1", "3", "2", ")"])); // 132
console.log(evaluate(["abs", "(", "1", "3", "2", ")"])); // 132
console.log(evaluate(["abs", "(", "cos", "(", "9", "0", ")", ")"])); // 0
console.log(evaluate(["cbrt", "(", "-", "(", "7", ")", "abs", "(", "-", "sqr", "(", "-", "4", "-", "cbrt", "(", "-", "1", ")", ")", ")", "-", "1", ")", ")"])); // -4
// rec
console.log(evaluate(["rec", "(", "1", ")"])); // 1
console.log(evaluate(["rec", "(", "0", ")"])); // Error 6
console.log(evaluate(["rec", "(", "2", "0", ")"])); // 0.05




// keyboard inputs
let path = [];
const END = ["end", true]
let funcMap = new Map([
    ["e", new Map([END])],
    ["p", new Map([
        ["i", new Map([END])],
        ["h", new Map([
            ["i", new Map([END])]
        ])],
    ])],
    ["t", new Map([
        ["a", new Map([
            ["n", new Map([END])]
        ])]
    ])],
    ["a", new Map([
        ["b", new Map([
            ["s", new Map([END])]
        ])],
        ["n", new Map([
            ["s", new Map([END])]
        ])],
        ["s", new Map([
            ["i", new Map([
                ["n", new Map([END])]
            ])]
        ])],
        ["c", new Map([
            ["o", new Map([
                ["s", new Map([END])]
            ])]
        ])],
        ["t", new Map([
            ["a", new Map([
                ["n", new Map([END])]
            ])]
        ])],
    ])],
    ["l", new Map([
        ["o", new Map([
            ["g", new Map([END])]
        ])],
        ["g", new Map([END])],
        ["n", new Map([END])],
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
    ["s", new Map([
        ["q", new Map([
            ["r", new Map([
                ["t", new Map([END])],
            ])]
        ])],
        ["i", new Map([
            ["n", new Map([END])]
        ])],
    ])],
]);

document.addEventListener("keydown", e => {
    let key = e.key;

    path.push(key.toLowerCase());
    let node = getFurthestNode(funcMap, [...path]);

    if (node instanceof Map && node.has("end")) {
        let c = path.join("");
        if (validFunctions.includes(c)) {
            addFuncToInput(c);
        } else if (validConstants.includes(c)) {
            addConstToInput(c);
        } else {
            throw Error(`Error: '${c}' is neither a function nor a constant`);
        }
        path.length = 0;
    } else if (node === false) {
        path.length = 0;
        if (funcMap.has(key)) {
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
    }
    // else if (key === "Shift") {
    //     shiftToggle()
    // }
});











// TODO: make it so sin(60)=sqrt(3)/2 exactly
// TODO: also add pi/3 and fractions
// TODO: add variables (A, B, C, ... Z)
// index.html
const input = document.getElementById("input");
const output = document.getElementById("output");
let stack = [];
let ans = 0;

function evaluateHTML() {
    output.value = evaluate(stack);
    ans = parseFloat(output.value);
}

function addToInput(c) {
    output.value = "";
    stack.push(c);
    switch (c) {
        case "*":
            input.value += "×";
            break;
        case "E":
            input.value += "×10^";
            break;
        case "sqr":
            input.value += "²"
            break;
        case "cube":
            input.value += "³"
            break;
        case "rec":
            input.value += "⁻¹"
            break;
        case "exp":
            input.value += "e^"
            break;
        case "expt10":
            input.value += "10^"
            break;
        default:
            input.value += c;
    }
}

function addConstToInput(c) {
    output.value = "";
    switch (c) {
        case "pi":
            stack.push("pi");
            input.value += "π";
            break;
        case "e":
            stack.push("e");
            input.value += "e";
            break;
        case "phi":
            stack.push("phi");
            input.value += "Φ";
            break;
        case "ans":
            stack.push("ans");
            input.value += "ANS";
    }

    if (/^var[A-Z]$/.test(c)) {
        stack.push(c);
        input.value += c[3];
    }
}

function addFuncToInput(c) {
    output.value = "";
    stack.push(c);
    stack.push("(");

    switch (c) {
        case "sqrt":
            input.value += "√"
            break;
        case "cbrt":
            input.value += "³√"
            break;
        case "sin":
        case "cos":
        case "tan":
            input.value += c;
            break;
        case "asin":
        case "acos":
        case "atan":
            input.value += c.slice(1) + "⁻¹";
            break;
        case "ln":
            input.value += "ln"
            break;
        case "lg":
            input.value += "log"
            break;
        case "abs":
            input.value += "abs"
            break;
    }

    input.value += "(";
}

function addFunc2ToInput(c) {
    output.value = "";
    stack.push(c)
    stack.push("(")

    switch (c) {
        case "root":
            input.value += "root"
            break;
        case "log":
            input.value += "log"
            break;
    }

    input.value += "(";
}

function clearInput() {
    output.value = "";
    input.value = "";
    stack.length = 0;
}

function deleteInput() {
    output.value = "";
    let c = stack.pop();
    let visualLength;
    if (c === "sqr" || c === "cube" || c === "pi" || c === "phi") {
        visualLength = 1;
    } else if (c === "exp") {
        visualLength = 2;
    } else if (c === "expt10") {
        visualLength = 3;
    } else if (c === "E") {
        visualLength = 4;
    } else {
        visualLength = c.length;
    }
    input.value = input.value.slice(0, -visualLength);

    if (c === "(" && isFunction(stack.at(-1))) {
        let f = stack.pop();
        let visualFuncLength;
        if (f === "sqrt") {
            visualFuncLength = 1;
        } else if (f === "cbrt") {
            visualFuncLength = 2;
        } else if (f === "lg") {
            visualFuncLength = 3;
        } else if (f === "asin" || f === "acos" || f === "atan") {
            visualFuncLength = 5;
        } else {
            visualFuncLength = f.length;
        }
        input.value = input.value.slice(0, -visualFuncLength);
    }
}

function getAns() {
    output.value = "";
    stack.push("ans");
    input.value += "ANS";
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









// settings
// calculator gradient change
document.addEventListener("DOMContentLoaded", () => {
    const calcGradient = localStorage.getItem("calculator-gradient");
    const border = document.querySelector(".calculator-border");

    if (!border || !calcGradient) return;

    border.classList.remove(...["water", "cotton-candy", "green-tea"]);
    border.classList.add(calcGradient);
});

// calculator gradient glow
document.addEventListener("DOMContentLoaded", () => {
    const calcGradState = localStorage.getItem("calc-grad-state");
    const border = document.querySelector(".calculator-border");

    if (!border) return;

    if (calcGradState === "true") {
        border.classList.add("calc-grad-state-true");
    } else {
        border.classList.remove("calc-grad-state-true");
    }
});

// light mode
document.addEventListener("DOMContentLoaded", () => {
    const modeState = localStorage.getItem("light-mode-state");
    const root = document.documentElement;

    if (!root) return;

    if (modeState === "true") {
        root.classList.add("light-mode");
    } else {
        root.classList.remove("light-mode");
    }
});