let values = []
let operators = []

function evaluate(expression) {
    try {
        return tryEvaluate(expression)
    } catch (e) {
        return e.toString()
    }
}

function tryEvaluate(expression) {

    values.length = 0
    operators.length = 0

    for (let i = 0; i < expression.length; i++) {
        let c = expression.at(i)

        if (isDigit(c) || c === '.') {
            let v = c

            while (i + 1 < expression.length && (isDigit(expression.at(i + 1)) || expression.at(i + 1) === '.')) {
                v += expression.at(i + 1)
                i++
            }

            values.push(parseFloat(v)) // TODO: 1.2.3 should return an error
        } else if (c === '-' && (i === 0 || isOperator(expression.at(i - 1)) || expression.at(i - 1) === '(')) {
            values.push(0)
            operators.push('-')
        } else if (isOperator(c)) {
            while (validExpression(values, operators) && shouldDoReduction(operators[operators.length - 1], c)) {
                reduce()
            }
            operators.push(c);
        } else if (c === '(') {
            operators.push(c);
        } else if (c === ')') {
            while (validExpression(values, operators) && shouldDoReduction(operators[operators.length - 1], c)) {
                reduce()
            }
            operators.pop()
        }

        else if (c === "pi") {
            values.push(Math.PI)
        } else if (c === "e") {
            values.push(Math.E)
        }

        else if (c === '%') {
            let n = values.pop()
            values.push(n / 100)
        } else if (c === '!') {
            let n = values.pop()

            if (!Number.isInteger(n) || n < 0) {
                throw new Error("Invalid factorial")
            }

            let newVal = 1
            for (let i = 2; i <= n; i++) {
                newVal *= i
            }

            values.push(newVal)
        }
    }

    while (validExpression(values, operators)) {
        reduce();
    }

    // input.value = values.pop();
    return values.pop();
}

function isDigit(c) {
    return /^[0-9]$/.test(c)
}

function isOperator(c) {
    return /^[+\-*/^E]$/.test(c)
}

function validExpression(values, operators) {
    return operators.length >= 1 && values.length >= 2
}

function shouldDoReduction(top, current) {
    if (top === '(') return false;
    if (current === ')') return true;
    if (top === '^' && current === '^') return false;
    return getPriority(top) >= getPriority(current);
}

function getPriority(op) {
    switch (op) {
        case '^':
        case '!':
        case 'E':
            return 2
        case '*':
        case '/':
        case '%':
            return 1
        case '+':
        case '-':
            return 0
        default:
            throw new Error("Unknown operator: " + op)
    }
}

function applyOp(op, left, right) {
    switch (op) {
        case '+':
            return left + right
        case '-':
            return left - right
        case '*':
            return left * right
        case '/':
            if (right === 0) {
                throw new Error("Division by zero")
            }
            return left / right
        case '^':
            return Math.pow(left, right)
        case 'E':
            return left * Math.pow(10, right)
        default:
            throw new Error("Unknown operator: " + op)
    }
}

function reduce() {
    let right = values.pop()
    let left = values.pop()
    let op = operators.pop()

    let reducedValue = applyOp(op, left, right)
    values.push(reducedValue)
}

// order of operations
console.log(evaluate("1+3^3*4".split(""))) // 109
console.log(evaluate("1.4+2.6".split(""))) // 4
console.log(evaluate("0.1+0.2".split(""))) // 0.3 TODO error
console.log(evaluate("0.1^2".split(""))) // 0.01 TODO error
console.log(evaluate("2^3^2".split(""))) // 512
console.log(evaluate("(2^3)^2".split(""))) // 64
console.log(evaluate("      1   +  2   +  3  * 4    - 5      ".split(""))) // 10
// errors
console.log(evaluate("1/0".split(""))) // Error
console.log(evaluate("1.1.3".split(""))) // Error TODO
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
console.log(evaluate("-0.1E^2".split(""))) // -10
// sqr, cbr, sqrt, cbrt
// console.log(evaluate(["1", "5", "sqr"])) // 225






// TODO: variables and functions

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
    switch (value) {
        case "E":
            stack.push(value)
            input.value += "x10^";
            break;
        default:
            stack.push(value)
            input.value += value;
    }
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
    stack.length = 0;
}