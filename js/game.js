async function loadLevel(level) {
    const levelContainer = document.getElementById('level-container');
    levelContainer.innerHTML = `
        <h2>Level ${level.id}</h2>
        <p>${level.description}</p>
        <pre>${level.code}</pre>
        <p><strong>Explanation:</strong> ${level.explanation}</p>
    `;
    editor.setValue('');

    // Prevent copy-paste on the level container
    levelContainer.addEventListener('copy', function(event) {
        event.preventDefault();
    });
    levelContainer.addEventListener('cut', function(event) {
        event.preventDefault();
    });
    levelContainer.addEventListener('paste', function(event) {
        event.preventDefault();
    });
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

    if (isCorrect) {
        displayOutput('Correct! Moving to the next level...');
        setTimeout(() => {
            nextLevel();
        }, 2000);
    } else {
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
        displayOutput('Congratulations! You have completed all levels.');
    }
}
