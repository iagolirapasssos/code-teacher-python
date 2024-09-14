let currentLevelIndex = localStorage.getItem('currentLevelIndex') ? parseInt(localStorage.getItem('currentLevelIndex')) : 0;

// Adicione uma verificação para garantir que o índice do nível está dentro do intervalo válido
if (currentLevelIndex >= levels.length) {
    currentLevelIndex = 0; // Reinicia o índice se estiver fora do intervalo
    localStorage.setItem('currentLevelIndex', currentLevelIndex);
}

document.getElementById('run-code').addEventListener('click', function () {
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
