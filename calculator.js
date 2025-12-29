let values = []
let operators = []

// evaluate: Array[String...] -> Number | String
function evaluate(expression) {
    try {
        let res = tryEvaluate(expression)
        return Math.round(res * 1e12) / 1e12;
    } catch (e) {
        return e.message
    }
}

// tryEvaluate: Array[String...] -> Number
function tryEvaluate(expression) {
    values.length = 0
    operators.length = 0

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
                reduceExpression()
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
        else if (isFunction(c)) { // TODO doesn't work properly for nested functions
            let depth = 1
            let j = i + 2

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

            let subExpression = expression.slice(i + 2, j)
            let n = tryEvaluate(subExpression)
            // console.log(subExpression)
            // console.log(c + " " + n)

            values.push(applyFunction(c, n))

            i = j + 1
        }
    }

    while (validExpression(values, operators)) {
        reduceExpression();
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
    let validFunctions = ["sqr", "sqrt", "cube", "cbrt", "sin", "cos", "tan", "ln", "lg"]
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

// reduceExpression: void
function reduceExpression() {
    let right = values.pop()
    let left = values.pop()
    let op = operators.pop()

    let reducedValue = applyOp(op, left, right)
    values.push(reducedValue)
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
        case "sin":
            return Math.sin(n * Math.PI / 180)
        case "cos":
            return Math.cos(n * Math.PI / 180)
        case "tan":
            let m = Math.tan(n * Math.PI / 180)
            if (m === Infinity || m === -Infinity) throw new Error("Is Infinity")
            return m
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
console.log(evaluate("0.1E^2".split(""))) // 10
console.log(evaluate("-0.1E^2".split(""))) // -10 TODO error
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
console.log(evaluate(["sin", "(", "6", "0", ")", "-", "cos", "(", "3", "0", ")"])) // 0 TODO error
console.log(evaluate(["tan", "(", "9", "0", ")"])) // Error TODO Error actual value received
// console.log(evaluate(["-", "1", "-", "sin", "(", "9", "0", ")"])) // -2
// console.log(evaluate(["sqrt", "(", "sqr", "(", "-", "1", "-", "sin", "(", "9", "0", ")", ")", "+", "5", ")"])) // 3
// lg and ln
console.log("==========START=======")
console.log(evaluate(["lg", "(", "1", ")"])) // 0
console.log(evaluate(["ln", "(", "e", ")"])) // 1
console.log(evaluate(["ln", "(", "e", "*", "2", ")"])) // 1.693147...
console.log("==========END=======")







// index.html
const input = document.getElementById("input");
const output = document.getElementById("output");
let stack = []
let ans = 0;

function evaluateHTML() {
    ans = evaluate(stack)
    output.value = ans;
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
            input.value += "[_]²"
            break
        case "sqrt":
            input.value += "√"
            break
        case "cube":
            input.value += "[_]³"
            break
        case "cbrt":
            input.value += "³√"
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