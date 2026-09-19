"use strict";

// Basic Math functions

function add(a, b) {
	return a + b;
}

function subtract(a, b) {
	return a - b;
}

function multiply(a, b) {
	return a * b;
}

function divide(a, b) {
	return a / b;
}

// operator
function operate(operator, num1, num2) {
	switch (operator) {
		case "+":
			return add(num1, num2);
		case "-":
			return subtract(num1, num2);
		case "*":
			return multiply(num1, num2);
		case "/":
			return divide(num1, num2);
	}
}

let displayValue = "0"; 
let firstNumber = null; 
let operatorClicked = null; // which operator button was pressed
let resetScreen = false; // true when the next digit should start a new number
let calculatorBroke = false;

let displayElement = document.getElementById("number-display");
let operatorDisplayElement = document.getElementById("operator-display");

function updateScreen() {
	displayElement.textContent = displayValue;
	operatorDisplayElement.textContent = operatorClicked === null ? "" : operatorClicked;
}

function pressNumber(number) {
	if (calculatorBroke) {
		clearAll();
	}

	if (resetScreen) {
		displayValue = number;
		resetScreen = false;
	} else if (displayValue === "0") {
		displayValue = number;
	} else {
		displayValue = displayValue + number;
	}

	updateScreen();
}

function pressDecimal() {
	if (calculatorBroke) {
		clearAll();
	}

	if (resetScreen) {
		displayValue = "0.";
		resetScreen = false;
		updateScreen();
		return;
	}

	if (displayValue.indexOf(".") === -1) {
		displayValue = displayValue + ".";
		updateScreen();
	}
}

function pressOperator(operator) {
	if (calculatorBroke) {
		clearAll();
	}

	let currentNumber = parseFloat(displayValue);

	if (operatorClicked !== null && resetScreen) {
		operatorClicked = operator;
		updateScreen();
		return;
	}

	if (operatorClicked === null) {
		firstNumber = currentNumber;
	} else {
		let result = operate(operatorClicked, firstNumber, currentNumber);

		if (!isFinite(result)) {
			showError();
			return;
		}

		result = roundNumber(result);
		firstNumber = result;
		displayValue = String(result);
		updateScreen();
	}

	operatorClicked = operator;
	resetScreen = true;
	updateScreen();
}

function pressEquals() {
	if (calculatorBroke) {
		clearAll();
		return;
	}

	if (operatorClicked === null || resetScreen) {
		return;
	}

	let secondNumber = parseFloat(displayValue);
	let result = operate(operatorClicked, firstNumber, secondNumber);

	if (!isFinite(result)) {
		showError();
		return;
	}

	result = roundNumber(result);
	displayValue = String(result);
	firstNumber = result;
	operatorClicked = null;
	resetScreen = true;
	updateScreen();
}

function roundNumber(number) {
	return Math.round(number * 100000000) / 100000000;
}

function showError() {
	calculatorBroke = true;
	operatorClicked = null;
	displayValue = "nice try, can't divide by zero";
	updateScreen();
}

function clearAll() {
	displayValue = "0";
	firstNumber = null;
	operatorClicked = null;
	resetScreen = false;
	calculatorBroke = false;
	updateScreen();
}

function pressBackspace() {
	if (calculatorBroke) {
		clearAll();
		return;
	}

	if (resetScreen) {
		return;
	}

	if (displayValue.length > 1) {
		displayValue = displayValue.slice(0, -1);
	} else {
		displayValue = "0";
	}

	updateScreen();
}

function pressSign() {
	if (calculatorBroke) {
		clearAll();
		return;
	}

	if (displayValue === "0") {
		return;
	}

	if (displayValue.charAt(0) === "-") {
		displayValue = displayValue.slice(1);
	} else {
		displayValue = "-" + displayValue;
	}

	updateScreen();
}

// hook up the buttons

let numberButtons = document.querySelectorAll(".number, .number-zero");
let operatorButtons = document.querySelectorAll(".operator");

numberButtons.forEach(function (button) {
	button.addEventListener("click", function () {
		if (button.value === ".") {
			pressDecimal();
		} else {
			pressNumber(button.value);
		}
	});
});

operatorButtons.forEach(function (button) {
	button.addEventListener("click", function () {
		pressOperator(button.value);
	});
});

document.getElementById("equals").addEventListener("click", pressEquals);
document.getElementById("clear").addEventListener("click", clearAll);
document.getElementById("backspace").addEventListener("click", pressBackspace);
document.getElementById("sign").addEventListener("click", pressSign);

// keyboard support

window.addEventListener("keydown", function (event) {
	let key = event.key;

	if (key >= "0" && key <= "9") {
		pressNumber(key);
		return;
	}

	switch (key) {
		case ".":
			pressDecimal();
			break;
		case "+":
		case "-":
		case "*":
		case "/":
			pressOperator(key);
			break;
		case "Enter":
		case "=":
			event.preventDefault();
			pressEquals();
			break;
		case "Backspace":
			pressBackspace();
			break;
		case "Escape":
			clearAll();
			break;
	}
});

updateScreen();
