// calculator gradient change
const calculatorDrop = document.getElementById("calc-grad-drop");
let calcGradient = localStorage.getItem("calculator-gradient");

if (calcGradient) {
    calculatorDrop.value = calcGradient;
}

calculatorDrop.addEventListener("change", e => {
    localStorage.setItem("calculator-gradient", e.target.value);
});

// calculator gradient glow
const calcGradOn = document.getElementById("calc-grad-on");
let calcGradState = localStorage.getItem("calc-grad-state");

calcGradOn.checked = calcGradState === "true";

calcGradOn.addEventListener("change", e => {
    localStorage.setItem("calc-grad-state", e.target.checked.toString());
});

// // light mode
// const mode = document.getElementById("mode-checkbox");
// let modeState = localStorage.getItem("mode-state");
//
// mode.checked = modeState === "true";
//
// mode.addEventListener("change", e => {
//     localStorage.setItem("mode-state", e.target.checked.toString());
// });