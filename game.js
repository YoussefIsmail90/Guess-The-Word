// Setting Game Name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector('footer').innerHTML = `${gameName} - Created by Youssef`;

// Setting Game Options
let numberOfTries = 6;
let numberOfLetters = 6;
let currentTry = 1;
let hintGiven = false;
let secretWord = "";

// List of possible words
const wordList = [
    "ABROAD", "CASUAL", "AROUND", "COUPLE",
    "ACCEPT", "CAUGHT", "ARRIVE", "COURSE",
    "ACCESS", "CENTRE", "ARTIST", "COVERS",
    "ACROSS", "CENTUM", "ASPECT", "CREATE",
    "ACTING", "CHANCE", "ASSESS", "CREDIT",
    "ACTION", "CHANGE", "ASSIST", "CRISIS",
    "ACTIVE", "CHARGE", "ASSUME", "CUSTOM",
    "ACTUAL", "CHOICE", "ATTACK", "DAMAGE",
    "ADVICE", "CHOOSE", "ATTEND", "DANGER",
    "ADVISE", "CHOSEN", "AUGUST", "DEALER",
    "AFFECT", "CHURCH", "AUTHOR", "DEBATE",
    "AFFORD", "CIRCLE", "AVENUE", "DECADE",
    "AFRAID", "CLIENT", "BACKED", "DECIDE",
    "AGENCY", "CLOSED", "BARELY", "DEFEAT",
    "AGENDA", "CLOSER", "BATTLE", "DEFEND",
    "ALMOST", "COFFEE", "BEAUTY", "DEFINE",
    "ALWAYS", "COLUMN", "BECAME", "DEGREE",
    "AMOUNT", "COMBAT", "BECOME", "DEMAND",
    "ANIMAL", "COMING", "BEFORE", "DEPEND",
    "ANNUAL", "COMMON", "BEHALF", "DEPUTY",
    "ANSWER", "COMPLY", "BEHIND", "DESERT",
    "ANYONE", "COPPER", "BELIEF", "DESIGN",
    "ANYWAY", "CORNER", "BELONG", "DESIRE",
    "APPEAL", "COSTLY", "BEAKER", "DETAIL",
    "APPEAR", "COUNTY", "BETTER", "DETECT",
    "BEYOND", "BUDGET", "DURING", "DEVICE",
    "BISHOP", "BURDEN", "EASILY", "DIFFER",
    "BORDER", "BUREAU", "EATING", "DINNER",
    "BOTTLE", "BUTTON", "EDITOR", "DIRECT",
    "BOTTOM", "CAMERA", "EFFECT", "DOCTOR",
    "BOUGHT", "CANCER", "EFFORT", "DOLLAR",
    "BRANCH", "CACTUS", "EIGHTH", "DOMAIN",
    "BREATH", "CARBON", "EITHER", "DOUBLE",
    "BRIDGE", "CAREER", "ELEVEN", "DRIVEN",
    "BRIGHT", "CASTLE", "EMERGE", "DRIVER"
];


// Function to select a random word
function selectRandomWord() {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex];
}

function generateInput() {
    const inputsContainer = document.querySelector(`.inputs`);
    inputsContainer.innerHTML = ''; // Clear previous inputs
    
    // Create Main Try Div
    for (let i = 1; i <= numberOfTries; i++) {
        const tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>Try ${i}</span>`;
        
        if (i !== 1) tryDiv.classList.add("disabled-inputs");
        
        // Create Inputs
        for (let j = 1; j <= numberOfLetters; j++) {
            const input = document.createElement("input");
            input.type = "text";
            input.id = `guess-${i}-letter-${j}`;
            input.setAttribute("maxlength", "1");
            input.disabled = i !== 1;
            tryDiv.appendChild(input);
        }
        
        inputsContainer.appendChild(tryDiv);
    }
    inputsContainer.children[0].children[1].focus();
}

function checkWord() {
    if (currentTry > numberOfTries) return;

    const guess = [];
    let allInputsEntered = true;

    // Collect guessed letters and validate if all inputs are filled
    for (let i = 1; i <= numberOfLetters; i++) {
        const input = document.getElementById(`guess-${currentTry}-letter-${i}`);
        const letter = input.value.trim().toUpperCase();
        
        if (letter === '') {
            allInputsEntered = false;
            break; // Exit loop early if any input is empty
        }

        guess.push(letter);
    }

    if (!allInputsEntered) {
        alert('Please enter all letters before checking.');
        return;
    }

    let correctInPlace = 0;
    let correctNotInPlace = 0;
    const correctPositions = new Set();
    const remainingLetters = new Map();

    // Calculate correct letters in place
    for (let i = 0; i < numberOfLetters; i++) {
        const guessedLetter = guess[i];
        const actualLetter = secretWord[i];
        
        if (guessedLetter === actualLetter) {
            correctInPlace++;
            correctPositions.add(i); // Track correct positions
        } else {
            if (remainingLetters.has(actualLetter)) {
                remainingLetters.set(actualLetter, remainingLetters.get(actualLetter) + 1);
            } else {
                remainingLetters.set(actualLetter, 1);
            }
        }
    }

    // Calculate correct letters not in place
    for (let i = 0; i < numberOfLetters; i++) {
        const guessedLetter = guess[i];
        if (!correctPositions.has(i) && remainingLetters.has(guessedLetter) && remainingLetters.get(guessedLetter) > 0) {
            correctNotInPlace++;
            remainingLetters.set(guessedLetter, remainingLetters.get(guessedLetter) - 1); // Decrement the count
        }
    }

    // Update UI based on correctInPlace and correctNotInPlace counts
    const messageElement = document.querySelector('.message');
    if (correctInPlace === numberOfLetters) {
        messageElement.innerHTML = "Congratulations! You've guessed the word!";
        disableAllInputs();
        showPlayAgainButton();
        return;
    } else {
        let feedbackMessage = "";
        if (correctInPlace > 0) {
            feedbackMessage += `${correctInPlace} letter(s) are correct and in the right place. `;
        }
        if (correctNotInPlace > 0) {
            feedbackMessage += `${correctNotInPlace} letter(s) are correct but not in the right place. `;
        }
        if ((numberOfLetters - correctInPlace - correctNotInPlace) > 0) {
            feedbackMessage += `${numberOfLetters - correctInPlace - correctNotInPlace} letter(s) are wrong. `;
        }
        messageElement.innerHTML = feedbackMessage.trim();
    }

    // Set the colors for the inputs
    for (let i = 1; i <= numberOfLetters; i++) {
        const input = document.getElementById(`guess-${currentTry}-letter-${i}`);
        const guessedLetter = guess[i - 1];
        const actualLetter = secretWord[i - 1];

        input.classList.remove('in-place', 'not-in-place', 'no');

        if (guessedLetter === actualLetter) {
            input.classList.add('in-place');
        } else if (secretWord.includes(guessedLetter) && remainingLetters.has(guessedLetter) && remainingLetters.get(guessedLetter) >= 0) {
            input.classList.add('not-in-place');
        } else {
            input.classList.add('no');
        }
    }

    // Move to the next try
    if (currentTry < numberOfTries) {
        currentTry++;
        enableNextTry();
    } else {
        messageElement.innerHTML = `Game Over! The word was ${secretWord}.`;
        showPlayAgainButton();
    }
}

function giveHint() {
    if (hintGiven) return;
    hintGiven = true;

    const randomIndex = Math.floor(Math.random() * numberOfLetters);
    const hintLetter = secretWord[randomIndex];
    document.querySelector('.message').innerHTML = `Hint: The word contains the letter "${hintLetter}" at position ${randomIndex + 1}.`;
}

function enableNextTry() {
    const currentDiv = document.querySelector(`.try-${currentTry - 1}`);
    const nextDiv = document.querySelector(`.try-${currentTry}`);
    currentDiv.classList.add("disabled-inputs");
    nextDiv.classList.remove("disabled-inputs");

    const inputs = nextDiv.querySelectorAll('input');
    inputs.forEach(input => input.disabled = false);
    inputs[0].focus();
}

function disableAllInputs() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => input.disabled = true);
}

function showPlayAgainButton() {
    const playAgainButton = document.querySelector('.play-again');
    playAgainButton.style.display = 'block';
}

function resetGame() {
    currentTry = 1;
    hintGiven = false;
    secretWord = selectRandomWord();
    document.querySelector('.message').innerHTML = '';
    generateInput();
    const playAgainButton = document.querySelector('.play-again');
    playAgainButton.style.display = 'none';
}

window.onload = function() {
    secretWord = selectRandomWord(); // Select a random word when the game starts
    generateInput();

    document.querySelector('.check').addEventListener('click', checkWord);
    document.querySelector('.hint').addEventListener('click', giveHint);
    document.querySelector('.play-again').addEventListener('click', resetGame);
};
