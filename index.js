const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copyButton]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheckbox = document.querySelector("#uppercase");
const lowercaseCheckbox = document.querySelector("#lowercase");
const numbersCheckbox = document.querySelector("#numbers");
const symbolsCheckbox = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckboxes = document.querySelectorAll("input[type=checkbox]");


let password = "";
let passwordLength = 10;
let checkCount = 0; 
handleSlider();

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    //generatePassword();
}
function setIndicator(color){
    indicator.style.backgroundColor = color;
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber(){
    return getRandomInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRandomInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRandomInteger(65, 91));
}

function generateSymbol() {
    const symbols = '!@#$%^&*()_+{}:"<>?[];,./';
    return symbols[getRandomInteger(0, symbols.length)];
}

function shufflePassword(password) {
    //fisher-yates shuffle algorithm
    for (let i = password.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = password[i];
        password[i] = password[j];
        password[j] = temp;
    }
    let shuffledPassword = "";
    password.forEach((el) => {
        shuffledPassword += el;
    });
    return shuffledPassword;
}
function calStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;
    if (uppercaseCheckbox.checked) hasUpper = true;
    if (lowercaseCheckbox.checked) hasLower = true;
    if (numbersCheckbox.checked) hasNumber = true;
    if (symbolsCheckbox.checked) hasSymbol = true;

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0"); // Green for strong
    } else if ((hasUpper || hasLower) && (hasNumber || hasSymbol) && passwordLength >= 6) {
        setIndicator("#ff0"); // Yellow for medium
    } else {
        setIndicator("#f00"); // Red for weak
    }
}

async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }

    //to show the copied message
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}
function handleCheckeBoxChange() {
    checkCount = 0;
    allCheckboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckeBoxChange); 
});

inputSlider.addEventListener("input", (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener("click", () => {
    if (passwordDisplay.value) {
        copyContent();
    }
});

generateBtn.addEventListener("click", ()=>{
    if (checkCount <= 0) return; // No checkbox is checked
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
    password = "";   //remove old password

    // if(uppercaseCheckbox.checked) {
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheckbox.checked) {
    //     password += generateLowerCase();
    // }
    // if(numbersCheckbox.checked) {
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheckbox.checked) {
    //     password += generateSymbol();
    // }

    let funcArr = [];
    if (uppercaseCheckbox.checked) {
        funcArr.push(generateUpperCase);
    }
    if (lowercaseCheckbox.checked) {
        funcArr.push(generateLowerCase);
    }
    if (numbersCheckbox.checked) {
        funcArr.push(generateRandomNumber);
    }
    if (symbolsCheckbox.checked) {
        funcArr.push(generateSymbol);
    }
    //compulsory addition of one character from each selected category
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }
    //remaining length to be filled
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randomIndex = getRandomInteger(0, funcArr.length);
        password += funcArr[randomIndex]();
    }

    //shuffle the password
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    calStrength();

});




