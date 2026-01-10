function getCheckboxAndSet(htmlID, storageItem) {
    const htmlCheckbox = document.getElementById(htmlID);
    const setting = localStorage.getItem(storageItem);
    htmlCheckbox.checked = setting === "true";

    htmlCheckbox.addEventListener("change", () => {
        localStorage.setItem(storageItem, htmlCheckbox.checked.toString());
    });
}

getCheckboxAndSet("angle-measure", "setting:use-radians");
getCheckboxAndSet("light-mode-on", "setting:light-mode");
getCheckboxAndSet("hide-calc-bg", "setting:hide-calc-bg");
getCheckboxAndSet("btn-glow-on", "setting:btn-glow-state");
getCheckboxAndSet("calc-glow-on", "setting:calc-glow-state");

// // degrees or radians
// const htmlCheckbox1 = document.getElementById("angle-measure");
// const setting1 = localStorage.getItem("setting:use-radians");
// const useRadians = setting1 === "true";
//
// htmlCheckbox1.checked = useRadians;
//
// htmlCheckbox1.addEventListener("change", () => {
//     localStorage.setItem("setting:use-radians", htmlCheckbox1.checked.toString());
// });
//
// // light mode
// const htmlCheckbox2 = document.getElementById("light-mode-on");
// const setting2 = localStorage.getItem("setting:light-mode");
// const lightModeOn = setting2 === "true";
//
// htmlCheckbox2.checked = lightModeOn;
//
// htmlCheckbox2.addEventListener("change", () => {
//     localStorage.setItem("setting:light-mode", htmlCheckbox2.checked.toString());
// });
//
// // hide calculator background
// const htmlCheckbox3 = document.getElementById("hide-calc-bg");
// const setting3 = localStorage.getItem("setting:hide-calc-bg");
// const hideCalcBG = setting3 === "true";
//
// htmlCheckbox3.checked = hideCalcBG;
//
// htmlCheckbox3.addEventListener("change", () => {
//     localStorage.setItem("setting:hide-calc-bg", htmlCheckbox3.checked.toString());
// });
//
// // button gradient glow
// const htmlCheckbox4 = document.getElementById("btn-glow-on");
// const setting4 = localStorage.getItem("setting:btn-glow-state");
// const btnGradOn = setting4 === "true";
//
// htmlCheckbox4.checked = btnGradOn;
//
// htmlCheckbox4.addEventListener("change", () => {
//     localStorage.setItem("setting:btn-glow-state", htmlCheckbox4.checked.toString());
// });
//
// // calculator gradient glow
// const htmlCheckbox5 = document.getElementById("calc-glow-on");
// const setting5 = localStorage.getItem("setting:calc-glow-state");
// const calcGradOn = setting5 === "true";
//
// htmlCheckbox5.checked = calcGradOn;
//
// htmlCheckbox5.addEventListener("change", () => {
//     localStorage.setItem("setting:calc-glow-state", htmlCheckbox5.checked.toString());
// });

function getDropdownAndSet(htmlID, storageItem) {
    const htmlDropdown = document.getElementById(htmlID);
    const option = localStorage.getItem(storageItem);

    htmlDropdown.value = option;

    htmlDropdown.addEventListener("change", () => {
        localStorage.setItem(storageItem, htmlDropdown.value);
    });
}

getDropdownAndSet("calc-grad-drop", "setting:calculator-gradient")
getDropdownAndSet("btn-grad-drop", "setting:button-gradient")

// calculator gradient change
// const calculatorDrop = document.getElementById("calc-grad-drop");
// const calcGradient = localStorage.getItem("calculator-gradient");
//
// calculatorDrop.value = calcGradient;
//
// calculatorDrop.addEventListener("change", () => {
//     localStorage.setItem("calculator-gradient", calculatorDrop.value);
// });

// reset button
const resetButton = document.getElementById("reset");
resetButton.addEventListener("click", () => {
    document.getElementById("angle-measure").checked = false;
    localStorage.setItem("setting:use-radians", "false");
    document.getElementById("light-mode-on").checked = false;
    localStorage.setItem("setting:light-mode", "false");
    document.getElementById("hide-calc-bg").checked = false;
    localStorage.setItem("setting:hide-body", "false");
    document.getElementById("btn-glow-on").checked = true;
    localStorage.setItem("setting:btn-glow-state", "true");
    document.getElementById("calc-glow-on").checked = true;
    localStorage.setItem("setting:calc-glow-state", "true");

    document.getElementById("calc-grad-drop").value = "water";
    localStorage.setItem("setting:calculator-gradient", "water");
    document.getElementById("btn-grad-drop").value = "blue";
    localStorage.setItem("setting:button-gradient", "blue");
})