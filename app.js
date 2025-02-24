/* 
? Date: 13/02/2025
? Author: Abu Taher Chowdhury
* Description: Color picker application with huge DOM functionalities
*/

// Globals
let toastContainer = null;
const defaultColor = {
  red: 221,
  green: 222,
  blue: 238,
};

const defaultPresetColors = [
  "#ffcdd2",
  "#f8bbd0",
  "#e1bee7",
  "#ff8a80",
  "#ff8aab",
  "#ea80fc",
  "#b39ddb",
  "#9fa81d",
  "#9fa8da",
  "#b388ff",
  "#8c9eff",
  "#82b1ff",
  "#03a9bf",
  "#03a9fe",
  "#00bc4d",
  "#00bcd4",
  "#009688",
  "#80d8ff",
  "#84ffff",
  "#a7ffeb",
  "#97A436",
  "#83ABFF",
  "#BA6ADF",
  "#7EB5A8",
];
let customColors = new Array(24);

const copySound = new Audio("./sound/copy_sound2.mp3");

// onload handler
window.onload = () => {
  main();
  updateColorCodeToDom(defaultColor);
  // display preset colors
  displayColorBoxes(
    document.getElementById("preset_colors"),
    defaultPresetColors
  );
  const customColorsString = localStorage.getItem("custom_colors");
  if (customColorsString) {
    customColors = JSON.parse(customColorsString);
    displayColorBoxes(document.getElementById("custom_colors"), customColors);
  }
};

// main or boot function, this function will take care of getting all the DOM references
function main() {
  // DOM References
  const generateRandomColorBtn = document.getElementById(
    "generate_random_color"
  );
  const inputHex = document.getElementById("input_hex");
  const colorSliderRed = document.getElementById("color_slider_red");
  const colorSliderGreen = document.getElementById("color_slider_green");
  const colorSliderBlue = document.getElementById("color_slider_blue");
  const copyToClipboardButton = document.getElementById("copy_to_clipboard");
  const saveToCustomBtn = document.getElementById("save_to_custom");
  const presetColorParent = document.getElementById("preset_colors");
  const customColorParent = document.getElementById("custom_colors");
  const bgFileInput = document.getElementById("bg_file_input");
  const bgPreview = document.getElementById("bg_preview");
  const bgFileInputBtn = document.getElementById("bg_file_input_btn");
  const bgFileDeleteBtn = document.getElementById("bg_file_delete_btn");
  bgFileDeleteBtn.style.display = "none";
  const bgController = document.getElementById("bg_controller");
  bgController.style.display = "none";

  // Event Listeners
  generateRandomColorBtn.addEventListener(
    "click",
    handleGenerateRandomColorBtn
  );
  inputHex.addEventListener("keyup", handleInputHex);
  colorSliderRed.addEventListener(
    "change",
    handleColorSlider(colorSliderRed, colorSliderGreen, colorSliderBlue)
  );
  colorSliderGreen.addEventListener(
    "change",
    handleColorSlider(colorSliderRed, colorSliderGreen, colorSliderBlue)
  );
  colorSliderBlue.addEventListener(
    "change",
    handleColorSlider(colorSliderRed, colorSliderGreen, colorSliderBlue)
  );
  copyToClipboardButton.addEventListener("click", handleCopyToClipboard);
  presetColorParent.addEventListener("click", handlePresetColorParent);
  saveToCustomBtn.addEventListener(
    "click",
    handleSaveToCustomBtn(customColorParent, inputHex)
  );
  customColorParent.addEventListener("click", handlePresetColorParent);

  bgFileInputBtn.addEventListener("click", function () {
    bgFileInput.click();
  });

  bgFileInput.addEventListener(
    "change",
    handleBgFileInput(bgPreview, bgFileDeleteBtn, bgController)
  );

  bgFileDeleteBtn.addEventListener(
    "click",
    handleBgFileDeleteBtn(bgPreview, bgFileDeleteBtn, bgController, bgFileInput)
  );

  document
    .getElementById("bg_size")
    .addEventListener("change", changeBackgroundPreferences);
  document
    .getElementById("bg_repeat")
    .addEventListener("change", changeBackgroundPreferences);
  document
    .getElementById("bg_position")
    .addEventListener("change", changeBackgroundPreferences);
  document
    .getElementById("bg_attachment")
    .addEventListener("change", changeBackgroundPreferences);
}

// event handlers
function handleGenerateRandomColorBtn() {
  let color = generateColorDecimal();
  updateColorCodeToDom(color);
  const mouseSound = new Audio("./sound/mouse-click.mp3");
  mouseSound.volume = 0.2;
  mouseSound.play();
}

function handleInputHex(e) {
  const hexColor = e.target.value;
  if (hexColor) {
    this.value = hexColor.toUpperCase();
    if (isHexValid(hexColor)) {
      const color = hexToDecimalColor(hexColor);
      updateColorCodeToDom(color);
    }
  }
}

function handleColorSlider(colorSliderRed, colorSliderGreen, colorSliderBlue) {
  return function () {
    const color = {
      red: parseInt(colorSliderRed.value),
      green: parseInt(colorSliderGreen.value),
      blue: parseInt(colorSliderBlue.value),
    };
    return updateColorCodeToDom(color);
  };
}

function handleCopyToClipboard() {
  const colorModeRadios = document.getElementsByName("color_mode");
  const mode = getCheckedValuesFromRadios(colorModeRadios);
  if (mode === null) {
    throw new Error("Invalid Radio Input");
  }
  if (toastContainer !== null) {
    toastContainer.remove();
    toastContainer = null;
  }

  let color = "";
  if (mode === "hex") {
    color = document.getElementById("input_hex").value;
    if (color && isHexValid(color)) {
      window.navigator.clipboard.writeText(`#${color}`);
      generateToastMsg(`#${color} copied`);
    } else {
      alert("Invalid Color Code");
    }
  } else {
    color = document.getElementById("input_rgb").value;
    if (color) {
      window.navigator.clipboard.writeText(color);
      generateToastMsg(`${color} copied`);
    } else {
      alert("Invalid RGB Color Code");
    }
  }
  const copySound = new Audio("./sound/copy_sound2.mp3");
  copySound.play();
}

function handlePresetColorParent(event) {
  const child = event.target;
  if (child.className === "color_box") {
    window.navigator.clipboard.writeText(child.getAttribute("data_color"));
    if (toastContainer !== null) {
      toastContainer.remove();
      toastContainer = null;
    }
    generateToastMsg(`${child.getAttribute("data_color")} copied`);
    const copySound = new Audio("./sound/copy_sound2.mp3");
    copySound.play();
  }
}

const alertSound = new Audio("./sound/copy_sound.mp3");
function handleSaveToCustomBtn(customColorParent, inputHex) {
  return function () {
    const color = `#${inputHex.value}`;
    if (customColors.includes(color)) {
      alertSound.volume = 0.5;
      alertSound.play();
      alert("Already saved");
      return;
    }
    customColors.unshift(color);
    if (customColors.length > 24) {
      customColors = customColors.slice(0, 24);
    }
    localStorage.setItem("custom_colors", JSON.stringify(customColors));
    removeChildren(customColorParent);
    displayColorBoxes(customColorParent, customColors);
    const mouseSound = new Audio("./sound/mouse-click.mp3");
    mouseSound.volume = 0.2;
    mouseSound.play();
  };
}

function handleBgFileInput(bgPreview, bgFileDeleteBtn, bgController) {
  return function (event) {
    const file = event.target.files[0];
    const imgUrl = URL.createObjectURL(file);
    // console.log(imgUrl);
    bgPreview.style.background = `url(${imgUrl})`;
    document.body.style.background = `url(${imgUrl})`;
    bgFileDeleteBtn.style.display = "inline";
    bgController.style.display = "block";
  };
}

function handleBgFileDeleteBtn(
  bgPreview,
  bgFileDeleteBtn,
  bgController,
  bgFileInput
) {
  return function () {
    bgPreview.style.background = `none`;
    bgPreview.style.background = `#dddeee`;
    document.body.style.background = `none`;
    document.body.style.backgroundColor = `#dddeee`;
    bgFileDeleteBtn.style.display = "none";
    bgController.style.display = "none";
    bgFileInput.value = null;
  };
}

// DOM functions
/**
 * Generate a dynamic dom element to show a toast message
 * @param {string} msg
 */
function generateToastMsg(msg) {
  toastContainer = document.createElement("div");
  toastContainer.innerText = msg;
  toastContainer.className = "toast_msg toast_msg_slide_in";

  toastContainer.addEventListener("click", function () {
    toastContainer.classList.remove("toast_msg_slide_in");
    toastContainer.classList.add("toast_msg_slide_out");

    toastContainer.addEventListener("animationend", function () {
      toastContainer.remove();
      toastContainer = null;
    });
  });

  document.body.appendChild(toastContainer);
}

/**
 * Find the checked elements from a list of radio buttons
 * @param {Array} nodes
 * @returns {string / null}
 */
function getCheckedValuesFromRadios(nodes) {
  let checkedValue = null;
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].checked) {
      checkedValue = nodes[i].value;
      break;
    }
  }
  return checkedValue;
}

/**
 * update dom elements with calculated color values
 * @param {object} color : ;
 */
function updateColorCodeToDom(color) {
  const hexColor = randomHexColorGenerator(color);
  const rgbColor = randomRGBColorGenerator(color);

  document.getElementById(
    "color_display"
  ).style.backgroundColor = `#${hexColor}`;
  document.getElementById("input_hex").value = hexColor;
  document.getElementById("input_rgb").value = rgbColor;
  document.getElementById("color_slider_red_label").innerText = color.red;
  document.getElementById("color_slider_red").value = color.red;
  document.getElementById("color_slider_green_label").innerText = color.green;
  document.getElementById("color_slider_green").value = color.green;
  document.getElementById("color_slider_blue_label").innerText = color.blue;
  document.getElementById("color_slider_blue").value = color.blue;
}

/**
 * create a div element with class name of color_box
 * @param {*} color
 * @returns {object}
 */
function generateColorBox(color) {
  const div = document.createElement("div");
  div.className = "color_box";
  div.style.backgroundColor = color;
  div.setAttribute("data_color", color);

  return div;
}

/**
 * this function will create
 * @param {object} parent
 * @param {Array} colors
 */
function displayColorBoxes(parent, colors) {
  colors.forEach((color) => {
    if (color) {
      const colorBox = generateColorBox(color);
      parent.appendChild(colorBox);
    }
  });
}

/**
 * remove all child from parent
 * @param {object} parent
 */
function removeChildren(parent) {
  let child = parent.lastElementChild;
  while (child) {
    parent.removeChild(child);
    child = parent.lastElementChild;
  }
}

function changeBackgroundPreferences() {
  document.body.style.backgroundSize = document.getElementById("bg_size").value;
  document.body.style.backgroundRepeat =
    document.getElementById("bg_repeat").value;
  document.body.style.backgroundPosition =
    document.getElementById("bg_position").value;
  document.body.style.backgroundAttachment =
    document.getElementById("bg_attachment").value;
}

// utils

/**
 * generate and return an object of three color decimal values
 * @returns {object}
 */
function generateColorDecimal() {
  const red = Math.floor(Math.random() * 255);
  const green = Math.floor(Math.random() * 255);
  const blue = Math.floor(Math.random() * 255);

  return {
    red,
    green,
    blue,
  };
}

/**
 * take a color object of three decimal values and return a hexadecimal color code
 * @param {object} color
 * @returns {string}
 */
function randomHexColorGenerator({ red, green, blue }) {
  const getTwoCode = (value) => {
    const hex = value.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  return `${getTwoCode(red)}${getTwoCode(green)}${getTwoCode(
    blue
  )}`.toUpperCase();
}

/**
 * take a color object of three decimal values and return a RGB color code
 * @param {object} color
 * @returns {string}
 */
function randomRGBColorGenerator({ red, green, blue }) {
  // const { red, green, blue } = generateColorDecimal();
  return `rgb(${red}, ${green}, ${blue})`;
}

/**
 * convert hex to decimal color object
 * @param {string} hex
 * @returns {object}
 */
function hexToDecimalColor(hex) {
  const red = parseInt(hex.slice(0, 2), 16);
  const green = parseInt(hex.slice(2, 4), 16);
  const blue = parseInt(hex.slice(4), 16);

  return {
    red,
    green,
    blue,
  };
}

/**
 * validate hex color code
 * @param {string} color
 * @returns {boolean}
 */
function isHexValid(color) {
  if (color.length !== 6) return false;
  return /^[0-9A-Fa-f]{6}$/i.test(color);
}
