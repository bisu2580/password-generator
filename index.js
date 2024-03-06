const inputSlider = document.querySelector("[data-lengthSlider]")
const lengthDisplay = document.querySelector("[data-lengthNumber]")
const passwordDisplay = document.querySelector("[data-passwordDisplay]")
const copyMsg = document.querySelector("[data-copyMsg]")
const copyBtn = document.querySelector("[data-copy]")
const uppercaseCheck = document.querySelector("#uppercase")
const lowercaseCheck = document.querySelector("#lowercase")
const numbersCheck = document.querySelector("#numbers")
const symbolsCheck = document.querySelector("#symbols")
const indicator = document.querySelector("[data-indicator]")
const generateBtn = document.querySelector(".generateButton")
const allCheckBox = document.querySelectorAll("input[type=checkbox]")
const symbols = "!@#$%^&*()+_-={}[]?:"
const prompt = document.querySelector("[data-strengthPrompt]")

let password = ""
let passwordLength = 10
let checkCount = 0
handleSlider()
function handleSlider() {
	inputSlider.length = passwordLength
	lengthDisplay.innerText = passwordLength
	const minimum = inputSlider.min
	const maximum = inputSlider.max
	inputSlider.style.backgroundSize =
		((passwordLength - minimum) * 100) / (maximum - minimum) + "% 100%"
}
function setIndicator(color) {
	indicator.style.backgroundColor = color
	indicator.style.boxShadow = `0px 0px 12px 1px ${color}`
}
function getRandomInteger(min, max) {
	return Math.floor(Math.random() * (max - min)) + min
}
function generateRandomNumber() {
	return getRandomInteger(0, 9)
}
function generateRandomUppercase() {
	let number = getRandomInteger(65, 91)
	return String.fromCharCode(number)
}
function generateRandomLowercase() {
	let number = getRandomInteger(97, 123)
	return String.fromCharCode(number)
}
function generateRandomSymbol() {
	const size = symbols.length
	const randumNumber = getRandomInteger(0, size)
	return symbols.charAt(randumNumber)
}
async function copyContent() {
	try {
		await navigator.clipboard.writeText(passwordDisplay.value)
		copyMsg.innerText = "copied"
	} catch (err) {
		copyMsg.innerText = "failed"
	}
	copyMsg.classList.add("active")
	setTimeout(() => {
		copyMsg.classList.remove("active")
	}, 2000)
}
function strengthCalculator() {
	let isUpperCase = false
	let isLowerCase = false
	let isNumber = false
	let isSymbol = false
	if (uppercaseCheck.checked) isUpperCase = true
	if (lowercaseCheck.checked) isLowerCase = true
	if (numbersCheck.checked) isNumber = true
	if (symbolsCheck.checked) isSymbol = true
	if (
		isUpperCase &&
		isLowerCase &&
		(isNumber || isSymbol) &&
		passwordLength >= 8
	) {
		setIndicator("#0f0")
		prompt.innerText = "Password is strong"
		prompt.style.color = "#0f0"
	} else if (
		(isUpperCase || isLowerCase) &&
		(isNumber || isSymbol) &&
		passwordLength >= 6
	) {
		setIndicator("#ff0")
		prompt.innerText = "Password is moderate"
		prompt.style.color = "#ff0"
	} else {
		setIndicator("#f00")
		prompt.innerText = "Password is weak!!!"
		prompt.style.color = "#f00"
	}
	prompt.classList.add("active")
	setTimeout(() => {
		prompt.classList.remove("active")
	}, 3000)
}
function handleCheckBoxChange() {
	checkCount = 0
	allCheckBox.forEach((checkbox) => {
		if (checkbox.checked) {
			checkCount++
		}
	})
	if (passwordLength < checkCount) {
		passwordLength = checkCount
		handleSlider()
	}
}
function shufflePassword(shuffle) {
	for (let i = 0; i < shuffle.length - 1; i++) {
		const j = Math.floor(Math.random() * (i + 1))
		const temp = shuffle[i]
		shuffle[i] = shuffle[j]
		shuffle[j] = temp
	}
	let str = ""
	shuffle.forEach((char) => (str += char))
	return str
}
allCheckBox.forEach((checkbox) => {
	checkbox.addEventListener("change", () => handleCheckBoxChange())
})
inputSlider.addEventListener("input", (event) => {
	passwordLength = event.target.value
	handleSlider()
})
generateBtn.addEventListener("click", () => {
	//none of the checkbox are selected
	if (checkCount <= 0) return
	if (passwordLength < checkCount) {
		passwordLength = checkCount
		handleSlider()
	}
	//remove old password
	password = ""
	let funArr = []
	if (uppercaseCheck.checked) funArr.push(generateRandomUppercase)
	if (lowercaseCheck.checked) funArr.push(generateRandomLowercase)
	if (numbersCheck.checked) funArr.push(generateRandomNumber)
	if (symbolsCheck.checked) funArr.push(generateRandomSymbol)
	for (let i = 0; i < funArr.length; i++) {
		password += funArr[i]()
	}
	for (let i = 0; i < passwordLength - funArr.length; i++) {
		let rndIndex = getRandomInteger(0, funArr.length)
		password += funArr[rndIndex]()
	}
	password = shufflePassword(Array.from(password))
	passwordDisplay.value = password
	strengthCalculator()
})
copyBtn.addEventListener("click", () => {
	if (passwordDisplay.value) copyContent()
})
