document.addEventListener("DOMContentLoaded", function() {
    const gameArea = document.querySelector('.inputs');
    const submitButton = document.getElementById('submit');
    const hintButton = document.getElementById('hint');
    const messageBox = document.querySelector('.message');
    const maxTries = 6;
    const wordLength = 5;
    const correctWord = "react"; // Example correct word, you can randomize or change this as needed
    let currentTry = 0;

    function createInputRow() {
        const row = document.createElement('div');
        row.className = `try-${currentTry}`;
        row.style.display = 'flex';
        row.style.justifyContent = 'center';
        row.style.marginBottom = '10px';

        for (let i = 0; i < wordLength; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            input.style.width = '30px';
            input.style.height = '30px';
            input.style.textAlign = 'center';
            input.style.fontSize = '18px';
            input.style.margin = '2px';
            input.style.backgroundColor = 'var(--input-background)';
            input.style.border = '2px solid var(--input-border)';
            input.style.borderRadius = '5px';
            input.style.color = 'var(--text-color)';
            row.appendChild(input);
        }
        return row;
    }

    function addInputRows() {
        for (let i = 0; i < maxTries; i++) {
            gameArea.appendChild(createInputRow());
        }
    }

    function getInputValues(row) {
        const inputs = row.querySelectorAll('input');
        return Array.from(inputs).map(input => input.value.toLowerCase());
    }

    function checkGuess(guess) {
        const result = [];
        for (let i = 0; i < wordLength; i++) {
            if (guess[i] === correctWord[i]) {
                result.push('in-place');
            } else if (correctWord.includes(guess[i])) {
                result.push('not-in-place');
            } else {
                result.push('no');
            }
        }
        return result;
    }

    function displayResult(row, result) {
        const inputs = row.querySelectorAll('input');
        for (let i = 0; i < result.length; i++) {
            inputs[i].classList.add(result[i]);
        }
    }

    function handleSubmit() {
        if (currentTry >= maxTries) {
            messageBox.textContent = 'Game Over! The correct word was: ' + correctWord;
            return;
        }

        const currentRow = document.querySelector(`.try-${currentTry}`);
        const guess = getInputValues(currentRow);
        if (guess.includes('')) {
            messageBox.textContent = 'Please fill in all letters!';
            return;
        }

        const result = checkGuess(guess);
        displayResult(currentRow, result);

        if (result.every(status => status === 'in-place')) {
            messageBox.textContent = 'Congratulations! You guessed the word!';
            return;
        }

        currentTry++;
        if (currentTry >= maxTries) {
            messageBox.textContent = 'Game Over! The correct word was: ' + correctWord;
        }
    }

    function handleHint() {
        messageBox.textContent = `Hint: The word starts with "${correctWord[0].toUpperCase()}" and ends with "${correctWord[wordLength - 1].toUpperCase()}".`;
    }

    submitButton.addEventListener('click', handleSubmit);
    hintButton.addEventListener('click', handleHint);

    addInputRows();
});
