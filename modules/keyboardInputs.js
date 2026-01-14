// import { VALID_FUNCTIONS, VALID_CONSTANTS } from "./calculations";
// import { addFuncToInput, addConstToInput,
//     addToInput, evaluateHTML, deleteInput, clearInput, moveLeft, moveRight, moveStart, moveEnd } from "./html";
//
// let path = [];
// const END = ["end", true]
// let funcMap = new Map([
//     ["a", new Map([
//         ["b", new Map([
//             ["s", new Map([END])]
//         ])],
//         ["c", new Map([
//             ["o", new Map([
//                 ["s", new Map([END])]
//             ])]
//         ])],
//         ["n", new Map([
//             ["s", new Map([END])]
//         ])],
//         ["s", new Map([
//             ["i", new Map([
//                 ["n", new Map([END])]
//             ])]
//         ])],
//         ["t", new Map([
//             ["a", new Map([
//                 ["n", new Map([END])]
//             ])]
//         ])],
//     ])],
//     ["c", new Map([
//         ["b", new Map([
//             ["r", new Map([
//                 ["t", new Map([END])]
//             ])]
//         ])],
//         ["o", new Map([
//             ["s", new Map([END])]
//         ])],
//     ])],
//     ["e", new Map([END])],
//     ["l", new Map([
//         ["g", new Map([END])],
//         ["n", new Map([END])],
//         ["o", new Map([
//             ["g", new Map([END])]
//         ])],
//     ])],
//     ["p", new Map([
//         ["i", new Map([END])],
//         ["h", new Map([
//             ["i", new Map([END])]
//         ])],
//     ])],
//     ["s", new Map([
//         ["i", new Map([
//             ["n", new Map([END])]
//         ])],
//         ["q", new Map([
//             ["r", new Map([
//                 ["t", new Map([END])],
//             ])]
//         ])],
//     ])],
//     ["t", new Map([
//         ["a", new Map([
//             ["n", new Map([END])]
//         ])]
//     ])],
// ]);
//
// window.addEventListener("keydown", e => {
//     let key = e.key;
//
//     path.push(key.toLowerCase());
//     let node = getFurthestNode(funcMap, [...path]);
//
//     if (node instanceof Map && node.has("end")) {
//         let c = path.join("");
//         if (VALID_FUNCTIONS.includes(c)) {
//             addFuncToInput(c);
//         } else if (VALID_CONSTANTS.includes(c)) {
//             addConstToInput(c);
//         } else {
//             throw Error(`Error: '${c}' is neither a function nor a constant`);
//         }
//         path.length = 0;
//     } else if (node === false) {
//         path.length = 0;
//         if (funcMap.has(key)) {
//             path.push(key);
//         }
//     }
//
//     function getFurthestNode(map, path) {
//         if (path.length === 0) return map;
//         if (!map.has(path[0])) return false;
//         return getFurthestNode(map.get(path[0]), path.slice(1));
//     }
//
//     if (/^[0-9.+\-*/^()]$/.test(key)) {
//         addToInput(key);
//     } else if (key === "Enter" || key === "=") {
//         e.preventDefault();
//         evaluateHTML();
//     } else if (key === "Backspace" || key === "Delete") {
//         deleteInput();
//     } else if (key === "Escape") {
//         clearInput();
//     } else if (key === "E") {
//         addToInput("E");
//     } else if (key === "x" || key === "X") {
//         addToInput("*");
//     } else if (key === "|") {
//         addFuncToInput("abs");
//     } else if (key === "!") {
//         addToInput("!");
//     } else if (key === "%") {
//         addToInput("%");
//     } else if (key === "ArrowLeft") {
//         moveLeft();
//     } else if (key === "ArrowRight") {
//         moveRight();
//     } else if (key === "Home") {
//         e.preventDefault();
//         moveStart();
//     } else if (key === "End") {
//         e.preventDefault();
//         moveEnd();
//     }
// });