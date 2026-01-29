export { VALID_FUNCTIONS, VALID_CONSTANTS, VALID_FUNCTIONS2,
    varMap, cToVisual, funcTree};

const VALID_FUNCTIONS = ["sqrt", "cbrt", "sin", "cos", "tan", "asin", "acos", "atan", "ln", "lg", "abs"];

const VALID_CONSTANTS = ["pi", "e", "phi", "ans",
    "va", "vb", "vc", "vd", "ve", "vf", "vg", "vy", "vz"];

const VALID_FUNCTIONS2 = ["root", "log"];

const varMap = new Map([
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

const cToVisual = new Map([
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

// ==================== KEYBOARD INPUTS ====================
const END = ["end", true];
const funcTree = new Map([
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