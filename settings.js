// calculator gradient change
const calculatorDrop = document.getElementById("calc-grad-drop");
let calcGradient = localStorage.getItem("calculator-gradient");

if (calcGradient) {
    calculatorDrop.value = calcGradient;
}

calculatorDrop.addEventListener("change", () => {
    localStorage.setItem("calculator-gradient", calculatorDrop.value);
});

// calculator gradient glow
const calcGradOn = document.getElementById("calc-grad-on");

calcGradOn.checked = localStorage.getItem("calc-grad-state") === "true";

calcGradOn.addEventListener("change", () => {
    localStorage.setItem("calc-grad-state", calcGradOn.checked.toString());
});

// light mode
const lightModeOn = document.getElementById("light-mode-on");

lightModeOn.checked = localStorage.getItem("light-mode-state") === "true";

lightModeOn.addEventListener("change", () => {
    localStorage.setItem("light-mode-state", lightModeOn.checked.toString());
});