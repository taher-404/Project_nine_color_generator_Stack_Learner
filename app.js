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
  blue: 238
}

// onload handler
window.onload = () => {
  main();
  updateColorCodeToDom(defaultColor)
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

}

// event handlers
function handleGenerateRandomColorBtn() {
  let color = generateColorDecimal();
  updateColorCodeToDom(color);
}

function handleInputHex(e) {
  const hexColor = e.target.value;
  if (hexColor) {
    this.value = hexColor.toUpperCase();
    if (isHexValid(hexColor)) {
      const color = hexToDecimalColor(hexColor);
      updateColorCodeToDom(color);
    }else{
     
  
      generateToastMsg(`Warning! `)
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
  if(mode === null){
    throw new Error('Invalid Radio Input')
  }
  if (toastContainer !== null) {
        toastContainer.remove();
        toastContainer = null;
      }
  
  let color = ''
  if(mode === 'hex'){
    color = document.getElementById("input_hex").value
    if(color && isHexValid(color)){
      window.navigator.clipboard.writeText(color);
      generateToastMsg(`#${color} copied`)
    } else{
      alert("Invalid Color Code");
    }
  } else{
    color = document.getElementById("input_rgb").value
    if(color) {
      window.navigator.clipboard.writeText(color);
      generateToastMsg(`${color} copied`)
    } else{
      alert("Invalid RGB Color Code");
    }
  }
  console.log(color);
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
