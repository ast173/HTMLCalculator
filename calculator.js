// evaluate: Array[String...] -> Number | String
function evaluate(expression) {
    try {
        let res = tryEvaluate(expression)
        return Math.round(res * 1e15) / 1e15;
    } catch (e) {
        return e.message
    }
}

// tryEvaluate: Array[String...] -> Number
function tryEvaluate(expression) {
    let values = []
    let operators = []

    // reduceExpression: void
    function reduceExpression() {
        let right = values.pop()
        let left = values.pop()
        let op = operators.pop()

        let reducedValue = applyOp(op, left, right)
        values.push(reducedValue)
    }

    // if (expression.length === 0) throw Error("Error 4: Empty expression")
    if (expression.length === 0) throw Error("")

    for (let i = 0; i < expression.length; i++) {
        let c = expression.at(i)

        if (c === " ") continue

        if (isDigit(c) || c === ".") {
            let v = c
            let hasDot = c === "."

            while (i + 1 < expression.length && (isDigit(expression.at(i + 1)) || expression.at(i + 1) === ".")) {
                let newC = expression.at(i + 1)

                if (newC === ".") {
                    if (hasDot) throw Error("Error 2: Multiple decimal places")
                    else hasDot = true
                }

                v += newC
                i++
            }

            if (v === ".") throw Error("Error 3: Lone decimal point is not a number")

            values.push(parseFloat(v))
        } else if (c === "-" && (i === 0 || isOperator(expression.at(i - 1)) || expression.at(i - 1) === "(")) {
            values.push(0)
            operators.push("-")
        } else if (isOperator(c)) {
            while (validExpression(values, operators) && shouldDoReduction(operators.at(-1), c)) {
                reduceExpression()
            }
            operators.push(c);
        } else if (c === "(") {
            if (i !== 0 && !isOperator(expression.at(i - 1))) {
                operators.push('*');
            }
            operators.push(c);
        } else if (c === ")") {
            while (validExpression(values, operators) && shouldDoReduction(operators.at(-1), c)) {
                reduceExpression();
            }
            operators.pop()
            if (i < expression.length - 1 && !isOperator(expression.at(i + 1))) {
                operators.push('*');
            }
        }

        // constants
        else if (c === "pi") {
            values.push(Math.PI)
        } else if (c === "e") {
            values.push(Math.E)
        }

        // functions that apply to items already on the stack
        else if (c === "%") {
            let n = values.pop()
            values.push(n / 100)
        } else if (c === "!") {
            let n = values.pop()

            if (!Number.isInteger(n) || n < 0) {
                throw new Error("Error 1: Factorial can only be applied to non negative integers")
            }

            let newVal = 1
            for (let i = 2; i <= n; i++) {
                newVal *= i
            }

            values.push(newVal)
        }

        // functions
        else if (isFunction(c)) {
            let depth = 1
            // skip the opening bracket
            let j = i + 2

            // index until ending bracket is reached or the end of the expression is reached
            while (j < expression.length) {
                let d = expression.at(j)

                if (d === "(") {
                    depth++
                } else if (d === ")") {
                    depth--
                }

                if (depth === 0) break

                j++
            }

            // evaluate the expression inside but not including the brackets (i + 2 to j - 1 inclusive)
            let subExpression = expression.slice(i + 2, j)
            let n = tryEvaluate(subExpression)
            // console.log("C and N: " + c + " " + n)

            values.push(applyFunction(c, n))

            // move the index i to j + 1. The for loop increments by one
            i = j
        }

        // console.log("Index: " + i)
        // console.log(`Values: ${values}`)
        // console.log("Operators: " + operators)
        // console.log("==============================")
    }

    while (validExpression(values, operators)) {
        reduceExpression();
        // console.log("Index: End")
        // console.log(`Values: ${values}`)
        // console.log("Operators: " + operators)
        // console.log("==============================")
    }

    let res = values.pop()
    if (isNaN(res)) throw Error("Error 4: Result is NaN")
    return res
}

// Let a Char be a String of length 1
// isDigit: Char -> Boolean
function isDigit(c) {
    return /^[0-9]$/.test(c)
}

// isOperator: Char -> Boolean
function isOperator(c) {
    return /^[+\-*/^E]$/.test(c)
}

// isFunction: String -> Boolean
function isFunction(c) {
    let validFunctions = ["sqr", "sqrt", "cube", "cbrt", "rec", "sin", "cos", "tan", "ln", "lg", "abs"]
    return validFunctions.includes(c)
}

// validExpression: Array[Number...] Array[String...] -> Boolean
function validExpression(values, operators) {
    return operators.length >= 1 && values.length >= 2
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
            return 2
        case "*":
        case "/":
            return 1
        case "+":
        case "-":
            return 0
        default:
            throw new Error("Unknown operator: " + op)
    }
}

// applyOp: Char Number Number -> Number
function applyOp(op, left, right) {
    switch (op) {
        case "+":
            return left + right
        case "-":
            return left - right
        case "*":
            return left * right
        case "/":
            if (right === 0) {
                throw new Error("Error 0: Division by zero")
            }
            return left / right
        case "^":
            return Math.pow(left, right)
        case "E":
            return left * Math.pow(10, right)
        default:
            throw new Error("Unknown operator: " + op)
    }
}

// applyFunction: String Number -> Number
function applyFunction(func, n) {
    switch (func) {
        case "sqr":
            return n * n
        case "sqrt":
            return Math.sqrt(n)
        case "cube":
            return n * n * n
        case "cbrt":
            return Math.cbrt(n)
        case "rec":
            if (n === 0) throw new Error("Error 6: Reciprocal of 0 is undefined")
            return Math.pow(n, -1)
        case "sin":
            return Math.sin(n * Math.PI / 180)
        case "cos":
            return Math.cos(n * Math.PI / 180)
        case "tan":
            if (Math.abs(Math.cos(n * Math.PI / 180)) < 6.125e-17) throw new Error("Error 5: tan(" + n + ") is undefined")
            return Math.tan(n * Math.PI / 180)
        case "asin":
            return Math.asin(n) * 180 / Math.PI
        case "acos":
            return Math.acos(n) * 180 / Math.PI
        case "atan":
            return Math.atan(n) * 180 / Math.PI
        case "ln":
            if (n <= 0) throw new Error(n + " is outside of the domain for ln");
            return Math.log(n)
        case "lg":
            if (n <= 0) throw new Error(n + " is outside of the domain for log10");
            return Math.log10(n)
        case "abs":
            return Math.abs(n)
    }
}

// order of operations
console.log(evaluate("1+3^3*4".split(""))) // 109
console.log(evaluate("1.4+2.6".split(""))) // 4
console.log(evaluate("0.1+0.2".split(""))) // 0.3
console.log(evaluate("0.1^2".split(""))) // 0.01
console.log(evaluate("2^3^2".split(""))) // 512
console.log(evaluate("(2^3)^2".split(""))) // 64
console.log(evaluate(".542".split(""))) // 0.542
console.log(evaluate("      1   +  2   +  3  * 4    - 5      ".split(""))) // 10
// errors
console.log(evaluate("1/0".split(""))) // Error
console.log(evaluate("1.1.3".split(""))) // Error
// pi and e
console.log(evaluate(["pi", "+", "e"])) // 5.860...
// negatives
console.log(evaluate("-90".split(""))) // -90
console.log(evaluate("----1")) // +1
console.log(evaluate("2*--5")) // +10
// percent
console.log(evaluate("100%".split(""))) // 1
console.log(evaluate("5001%".split(""))) // 50.01
console.log(evaluate("1.3%".split(""))) // 0.013
console.log(evaluate("10.00%*20".split(""))) // 2
console.log(evaluate("10.00%+20*4%".split(""))) // 0.9
console.log(evaluate("1%^4".split(""))) // 1e-8
// factorial
console.log(evaluate("0!".split(""))) // 1
console.log(evaluate("1!".split(""))) // 1
console.log(evaluate("5!".split(""))) // 120
console.log(evaluate("5!^3".split(""))) // 1728000
console.log(evaluate("2^4!".split(""))) // TODO: which one takes priority?
// x10^
console.log(evaluate("2E5".split(""))) // 200000
console.log(evaluate("8E-3".split(""))) // 0.008
console.log(evaluate("-8E-3".split(""))) // -0.008
console.log(evaluate("2E-3^2".split(""))) // 2e-9
console.log(evaluate("0.1E2".split(""))) // 10
console.log(evaluate("-0.1E2".split(""))) // -10
// bracket multiplication
console.log(evaluate("2(3)".split(""))) // 6
console.log(evaluate("(4)9".split(""))) // 36
console.log(evaluate("-(5)(3)".split(""))) // 15 TODO error
console.log(evaluate("-(5)(3)+5".split(""))) // 20 TODO error
// sqr, cube, sqrt, cbrt, and trig functions
console.log(evaluate(["sqr", "(", "-", "4", ")"])) // 16
console.log(evaluate(["sqrt", "(", "9", ")"])) // 3
console.log(evaluate(["cube", "(", "3", ")"])) // 27
console.log(evaluate(["cbrt", "(", "-", "6", "4", ")"])) // -4
console.log(evaluate(["sin", "(", "9", "0", ")"])) // 1
console.log(evaluate(["sin", "(", "0", ")"])) // 0
console.log(evaluate(["sin", "(", "4", "5", ")"])) // 0.707...
console.log(evaluate(["cos", "(", "6", "0", ")"])) // 0.5
console.log(evaluate(["sin", "(", "6", "0", ")", "-", "cos", "(", "3", "0", ")"])) // 0
console.log(evaluate(["tan", "(", "9", "0", ")"])) // Error
console.log(evaluate(["-", "1", "-", "sin", "(", "9", "0", ")"])) // -2
console.log(evaluate(["sqrt", "(", "sqr", "(", "-", "1", "-", "sin", "(", "9", "0", ")", ")", "+", "5", ")"])) // 3
// lg and ln
console.log(evaluate(["lg", "(", "1", ")"])) // 0
console.log(evaluate(["ln", "(", "e", ")"])) // 1
console.log(evaluate(["ln", "(", "e", "*", "2", ")"])) // 1.693147...
// abs
console.log(evaluate(["abs", "(", "-", "1", "3", "2", ")"])) // 132
console.log(evaluate(["abs", "(", "1", "3", "2", ")"])) // 132
console.log(evaluate(["abs", "(", "cos", "(", "9", "0", ")", ")"])) // 0
console.log(evaluate(["cbrt", "(", "-", "(", "7", ")", "abs", "(", "-", "sqr", "(", "-", "4", "-", "cbrt", "(", "-", "1", ")", ")", ")", "-", "1", ")", ")"])) // -4
// rec
console.log(evaluate(["rec", "(", "1", ")"])) // 1
console.log(evaluate(["rec", "(", "0", ")"])) // Error
console.log(evaluate(["rec", "(", "2", "0", ")"])) // 0.05





// TODO: add sqrt, cbrt, pi, log, trig functions, and absolute value |-3|
// TODO: make a setting to disable the action where enter on a button presses the button
// Keyboard inputs
document.addEventListener("keydown", e => {
    if (/^[0-9.+\-*/^()]$/.test(e.key)) {
        addToInput(e.key)
    } else if (e.key === "Enter" || e.key === "=") {
        evaluateHTML()
    } else if (e.key === "Backspace" || e.key === "Delete") {
        deleteInput()
    } else if (e.key === "Escape") {
        clearInput()
    } else if (e.key === "e") {
        addConstToInput("e")
    } else if (e.key === "E") {
        addToInput("E")
    } else if (e.key === "x" || e.key === "X") {
        addToInput("*")
    } else if (e.key === "|") {
        addFuncToInput("abs")
    } else if (e.key === "Shift") {
        shiftToggle()
    }
});













// index.html
const input = document.getElementById("input");
const output = document.getElementById("output");
let stack = []
let ans = 0;

function evaluateHTML() {
    output.value = evaluate(stack);
}

function addToInput(value) {
    output.value = "";
    if (value === "E") {
        stack.push(value)
        input.value += "x10^";
    } else {
        stack.push(value)
        input.value += value;
    }
}

function addConstToInput(value) {
    output.value = "";
    switch (value) {
        case "pi":
            stack.push("pi")
            input.value += "π";
            break
        case "e":
            stack.push("e")
            input.value += "e";
            break
    }
}

function addFuncToInput(value) {
    output.value = "";
    stack.push(value)
    stack.push("(")

    switch (value) {
        case "sqr":
            // input.value += "[_]²"
            input.value += "sqr"
            break
        case "sqrt":
            input.value += "√"
            break
        case "cube":
            // input.value += "[_]³"
            input.value += "cube"
            break
        case "cbrt":
            input.value += "³√"
            break
        case "rec":
            // input.value += "[_]⁻¹"
            input.value += "rec"
            break
        case "sin":
        case "cos":
        case "tan":
            input.value += value;
            break
        case "asin":
        case "acos":
        case "atan":
            input.value += value + "⁻¹";
            break
        case "ln":
            input.value += "ln"
            break
        case "lg":
            input.value += "log"
            break
        case "abs":
            input.value += "abs"
            break
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
    input.value = input.value.slice(0, -1)
    stack.pop();
}

function getAns() {
    output.value = "";
    let parts = ans.toString().split("")
    stack.push(...parts)
    input.value += "ANS";
}

let shiftEnabled = false;
const shiftButton = document.getElementById("shift");
function shiftToggle() {
    shiftEnabled = !shiftEnabled;
    document.documentElement.classList.toggle("shift-enabled", shiftEnabled);
}

shiftButton.onclick = e => shiftToggle()
document.querySelectorAll(".shiftOff").forEach(btn => {
    btn.classList.toggle("hidden", shiftEnabled);
});






// settings
let angleMeasure = "degrees"
let mode = "dark"
let buttonGradientEnabled = true
let buttonGradient = 0
let calculatorGradientEnabled = true
let calculatorGradient = "water"

function resetSettings() {
    angleMeasure = "degrees"
    mode = "dark"
    buttonGradientEnabled = true
    buttonGradient = 0
    calculatorGradientEnabled = true
    calculatorGradient = "water"
}

document.addEventListener("DOMContentLoaded", () => {
    const calcGradient = localStorage.getItem("calculator-gradient");
    const border = document.querySelector(".calculator-border");

    if (!border || !calcGradient) return;

    border.classList.remove(...["water", "cotton-candy", "green-tea"]);
    border.classList.add(calcGradient);
});

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