const CALCULATOR_GRADIENTS = ["glacier-water", "cotton-candy", "green-tea", "sago-taro"];
const BUTTON_GRADIENTS = ["red", "yellow", "green", "blue", "purple", "black", "white"];
document.addEventListener("DOMContentLoaded", () => {
    // light mode
    const root = document.documentElement;
    const setting2 = localStorage.getItem("setting:light-mode");
    const useLightMode = setting2 === "true";

    if (useLightMode) {
        root.classList.add("light-mode");
    } else {
        root.classList.remove("light-mode");
    }

    // hide calculator body
    const calculator = document.querySelector(".calculator");
    const setting3 = localStorage.getItem("setting:hide-body");
    const hideCalcBody = setting3 === "true";

    if (hideCalcBody) {
        calculator.classList.add("hide-calc");
    } else {
        calculator.classList.remove("hide-calc");
    }

    // button gradient glow
    const buttons = calculator.querySelectorAll("button");
    const setting4 = localStorage.getItem("setting:btn-glow-state");
    const showBtnGlow = setting4 === "true";

    if (showBtnGlow) {
        for (let button of buttons) {
            button.classList.remove("hide-button-glow");
        }
    } else {
        for (let button of buttons) {
            button.classList.add("hide-button-glow");
        }
    }

    // button gradient change
    const btnGradient = localStorage.getItem("setting:button-gradient");

    for (let button of buttons) {
        button.classList.remove(...BUTTON_GRADIENTS);
        button.classList.add(btnGradient);
    }

    // calculator gradient glow
    const border = document.querySelector(".calculator-border");
    const setting5 = localStorage.getItem("setting:calc-glow-state");
    const showCalcGlow = setting5 === "true";

    if (showCalcGlow) {
        border.classList.add("show-calculator-glow");
    } else {
        border.classList.remove("show-calculator-glow");
    }

    // calculator gradient change
    const calcGradient = localStorage.getItem("setting:calculator-gradient");

    border.classList.remove(...CALCULATOR_GRADIENTS);
    border.classList.add(calcGradient);
});