export { evaluate, VALID_CONSTANTS, VALID_FUNCTIONS, isFunction }
import { ans } from "./html.js";

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
        let nextC = expression[i + 1];
        let lastC = expression[i - 1];

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
        } else if (c === "-" && (i === 0 || isOperator(lastC) || lastC === "(")) {
            values.push(0);
            operators.push("-");
        } else if (isOperator(c)) {
            while (validExpression(values, operators) && shouldDoReduction(operators.at(-1), c)) {
                reduceExpression();
            }
            operators.push(c);
        } else if (c === "(") {
            if (i !== 0 && !isOperator(lastC) && lastC !== ")") {
                operators.push("*");
            }
            if (isConstant(lastC)) {
                operators.push("*");
            }
            operators.push(c);
        } else if (c === ")") {
            while (validExpression(values, operators) && shouldDoReduction(operators.at(-1), c)) {
                reduceExpression();
            }
            operators.pop();
            if (i < expression.length - 1 && !isOperator(nextC)) {
                operators.push("*");
            }
            if (isConstant(nextC)) {
                operators.push("*");
            }
        }

        // constants
        else if (isConstant(c)) {
            if (i !== 0 && !isOperator(lastC) && !["(", ")"].includes(lastC)) {
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

            if (i < expression.length - 1 && !isOperator(nextC) && !["(", ")"].includes(lastC)) {
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
            if (i !== 0 && !isOperator(lastC)) {
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
    }

    while (operators.at(-1) === "(") {
        operators.pop();
    }

    while (validExpression(values, operators)) {
        reduceExpression();
    }

    let res = values.pop();
    if (isNaN(res)) throw Error("Error 4: Result is NaN");
    return res;
}

// isDigit: String -> Boolean
function isDigit(c) {
    return /^[0-9]$/.test(c);
}

// isOperator: String -> Boolean
function isOperator(c) {
    return /^[+\-*/^E]$/.test(c);
}

const VALID_FUNCTIONS = ["sqrt", "cbrt", "sin", "cos", "tan", "asin", "acos", "atan", "ln", "lg", "abs"];
// isFunction: String -> Boolean
function isFunction(c) {
    return VALID_FUNCTIONS.includes(c);
}

const VALID_CONSTANTS = ["pi", "e", "phi", "ans"];
// isConstant: String -> Boolean
function isConstant(c) {
    return VALID_CONSTANTS.includes(c);
}

const VALID_FUNCTIONS2 = ["root", "log"];
// isFunction2: String -> Boolean
function isFunction2(c) {
    return VALID_FUNCTIONS2.includes(c);
}

// validExpression: Array[Number...] Array[String...] -> Boolean
function validExpression(values, operators) {
    return operators.length >= 1 && values.length >= 2;
}

// shouldDoReduction: String String -> Boolean
function shouldDoReduction(top, current) {
    if (top === "(") return false;
    if (current === ")") return true;
    if (top === "^" && current === "^") return false;
    return getPriority(top) >= getPriority(current);
}

// getPriority: String -> Number
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

// applyOp: String Number Number -> Number
function applyOp(op, left, right) {
    switch (op) {
        case "+":
            return left + right;
        case "-":
            return left - right;
        case "*":
            return left * right;
        case "/":
            if (right === 0) throw new Error("Error 0: Division by zero");
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

function applyFunction2(func, b, a) {
    switch (func) {
        case "root": // TODO: restrictions here
            if (a < 0 && b % 2 === 0) throw new Error("Error 11: '" + a + "' is outside of the domain for root");
            return Math.pow(a, 1 / b);
        case "log":
            if (b <= 0) throw new Error("Error 12: base of log must be positive");
            return Math.log(a) / Math.log(b);
    }
}