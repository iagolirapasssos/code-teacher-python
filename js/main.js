let currentLevelIndex = localStorage.getItem('currentLevelIndex') ? parseInt(localStorage.getItem('currentLevelIndex')) : 0;

if (currentLevelIndex >= levels.length) {
    currentLevelIndex = 0;
    localStorage.setItem('currentLevelIndex', currentLevelIndex);
}

document.getElementById('run-code').addEventListener('click', function () {
    //document.getElementById('background-music').play(); // Tocar a música ao clicar no botão
    const level = levels[currentLevelIndex];
    if (level) {
        runCode(level);
    } else {
        displayOutput('Level not found.');
    }
});


function startGame() {
    const level = levels[currentLevelIndex];
    if (level) {
        loadLevel(level);
    } else {
        displayOutput('Level not found.');
    }
}
