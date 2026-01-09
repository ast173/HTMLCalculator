// calculator gradient change
const calculatorDrop = document.getElementById("calc-grad-drop");
const calcGradient = localStorage.getItem("calculator-gradient");

if (calcGradient) {
    calculatorDrop.value = calcGradient;
}

calculatorDrop.addEventListener("change", () => {
    localStorage.setItem("calculator-gradient", calculatorDrop.value);
});

// degrees or radians
const htmlCheckbox5 = document.getElementById("angle-measure");
const setting5 = localStorage.getItem("use-radians");
const useRadians = setting5 === "true";

htmlCheckbox5.checked = useRadians;

htmlCheckbox5.addEventListener("change", () => {
    localStorage.setItem("use-radians", htmlCheckbox5.checked.toString());
});

// show calculator background
const htmlCheckbox4 = document.getElementById("hide-calc-bg");
const setting4 = localStorage.getItem("setting-hide-calc-bg");
const hideCalcBG = setting4 === "true";

htmlCheckbox4.checked = hideCalcBG;

htmlCheckbox4.addEventListener("change", () => {
    localStorage.setItem("hide-calc-bg", htmlCheckbox4.checked.toString());
});

// button gradient glow
const htmlCheckbox3 = document.getElementById("btn-grad-on");
const setting3 = localStorage.getItem("calc-grad-state");
const btnGradOn = setting3 === "true";

htmlCheckbox3.checked = btnGradOn;

htmlCheckbox3.addEventListener("change", () => {
    localStorage.setItem("calc-grad-state", htmlCheckbox3.checked.toString());
});

// calculator gradient glow
const htmlCheckbox1 = document.getElementById("calc-grad-on");
const setting1 = localStorage.getItem("calc-grad-state");
const calcGradOn = setting1 === "true";

htmlCheckbox1.checked = calcGradOn;

htmlCheckbox1.addEventListener("change", () => {
    localStorage.setItem("calc-grad-state", htmlCheckbox1.checked.toString());
});

// light mode
const htmlCheckbox2 = document.getElementById("light-mode-on");
const setting2 = localStorage.getItem("light-mode-state");
const lightModeOn = setting2 === "true";

htmlCheckbox2.checked = lightModeOn;

htmlCheckbox2.addEventListener("change", () => {
    localStorage.setItem("light-mode-state", htmlCheckbox2.checked.toString());
});

// reset button
const resetButton = document.getElementById("reset");
resetButton.addEventListener("click", () => {
    calculatorDrop.value = "water";
    localStorage.setItem("calculator-gradient", "water");
    htmlCheckbox1.checked = true;
    localStorage.setItem("calc-grad-state", "true");
    htmlCheckbox2.checked = false;
    localStorage.setItem("light-mode-state", "false");
})