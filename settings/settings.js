function getCheckboxAndSet(htmlID, storageItem) {
    const htmlCheckbox = document.getElementById(htmlID);
    const setting = localStorage.getItem(storageItem);
    htmlCheckbox.checked = setting === "true";

    htmlCheckbox.addEventListener("change", () => {
        localStorage.setItem(storageItem, htmlCheckbox.checked.toString());
    });
}

function getDropdownAndSet(htmlID, storageItem) {
    const htmlDropdown = document.getElementById(htmlID);
    const option = localStorage.getItem(storageItem);

    htmlDropdown.value = option;

    htmlDropdown.addEventListener("change", () => {
        localStorage.setItem(storageItem, htmlDropdown.value);
    });
}

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

    document.getElementById("calc-grad-drop").value = "glacier-water";
    localStorage.setItem("setting:calculator-gradient", "glacier-water");
    document.getElementById("btn-grad-drop").value = "blue";
    localStorage.setItem("setting:button-gradient", "blue");
});

function initSettingCheckbox(storageItem, defaultValue) {
    if (localStorage.getItem(storageItem) === null) {
        localStorage.setItem(storageItem, defaultValue);
    }
}

function initSettingDropdown(storageItem, htmlElement, defaultValue) {
    if (localStorage.getItem(storageItem) === null) {
        localStorage.setItem(storageItem, defaultValue);
        document.getElementById(htmlElement).value = defaultValue;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initSettingCheckbox("setting:use-radians", "false");
    initSettingCheckbox("setting:light-mode", "false");
    initSettingCheckbox("setting:hide-body", "false");
    initSettingCheckbox("setting:btn-glow-state", "true");
    initSettingCheckbox("setting:calc-glow-state", "true");
    initSettingDropdown("setting:calculator-gradient", "calc-grad-drop", "glacier-water");
    initSettingDropdown("setting:button-gradient", "btn-grad-drop", "blue");

    getCheckboxAndSet("angle-measure", "setting:use-radians");
    getCheckboxAndSet("light-mode-on", "setting:light-mode");
    getCheckboxAndSet("hide-calc-bg", "");
    getCheckboxAndSet("btn-glow-on", "setting:btn-glow-state");
    getCheckboxAndSet("calc-glow-on", "setting:calc-glow-state");

    getDropdownAndSet("calc-grad-drop", "setting:calculator-gradient");
    getDropdownAndSet("btn-grad-drop", "setting:button-gradient");
});