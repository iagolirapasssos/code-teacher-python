async function loadLevel(level) {
    const levelContainer = document.getElementById('level-container');
    levelContainer.innerHTML = `
        <h2>Level ${level.id}</h2>
        <p>${level.description}</p>
        <pre>${level.code}</pre>
        <p><strong>Explanation:</strong> ${level.explanation}</p>
    `;
    editor.setValue('');

    levelContainer.addEventListener('copy', event => event.preventDefault());
    levelContainer.addEventListener('cut', event => event.preventDefault());
    levelContainer.addEventListener('paste', event => event.preventDefault());
}

function getUserCode() {
    return editor.getValue();
}

function displayOutput(message) {
    const outputContainer = document.getElementById('output-container');
    outputContainer.innerText = message;
}

async function runCode(level) {
    const userCode = getUserCode();
    const isCorrect = await level.test(userCode);
    const correctSound = document.getElementById('correct-sound');
    const errorSound = document.getElementById('error-sound');

    if (isCorrect) {
        correctSound.play();
        displayOutput('Correct! Moving to the next level...');
        setTimeout(() => {
            nextLevel();
        }, 2000);
    } else {
        errorSound.play();
        displayOutput('Incorrect, try again.');
    }
}

function nextLevel() {
    currentLevelIndex++;
    if (currentLevelIndex < levels.length) {
        localStorage.setItem('currentLevelIndex', currentLevelIndex);
        loadLevel(levels[currentLevelIndex]);
        displayOutput('');
    } else {
        document.getElementById('game-over-sound').play();
        displayOutput('Congratulations! You have completed all levels.');
    }
}
