const MAX_BETS = 3;
const SPIN_INTERVAL = 50;
const TOTAL_SPINS = 100;
const IMAGE_SIZE = 100;
const NAME_MAPPING = {
    bau: 'Bầu',
    cua: 'Cua',
    tom: 'Tôm',
    ca: 'Cá',
    nai: 'Nai',
    ga: 'Gà'
}

const resultBoard = document.getElementById('resultBoard');
const imageRow = document.getElementById('imageRow');
const spinButton = document.getElementById('spinButton');
const resetButton = document.getElementById('resetButton');

const state = {
    bets: {
        bau: 0,
        cua: 0,
        tom: 0,
        ca: 0,
        nai: 0,
        ga: 0,
    },
    results: {
        bau: 0,
        cua: 0,
        tom: 0,
        ca: 0,
        nai: 0,
        ga: 0,
    },
    spinning: false,
    totalCounter: 0,
};

initializeBoard(resultBoard, 3);

Object.keys(state.bets).forEach(imageName => {
    const cell = createImageCell(imageName);
    cell.addEventListener('click', () => placeBet(imageName));
    imageRow.appendChild(cell);
});

spinButton.classList.add('disabled');

function initializeBoard(board, cellCount) {
    for (let i = 0; i < cellCount; i++) {
        const cell = document.createElement('div');
        cell.innerHTML = `<img src="" alt="" width="${IMAGE_SIZE}">`;
        board.appendChild(cell);
    }
}

function createImageCell(imageName) {
    const cell = document.createElement('div');
    cell.classList.add('image-cell');
    cell.innerHTML = `<img class='image' src='${imageName}.png' alt='${imageName}' width='${IMAGE_SIZE}'><div class='counter'>${state.bets[imageName]}</div>`;
    return cell;
}

function placeBet(imageName) {
    if (state.spinning || state.totalCounter === MAX_BETS) return;

    state.bets[imageName]++;
    state.totalCounter++;
    updateBets();
}

function updateBets() {
    Object.keys(state.bets).forEach(imageName => {
        const cell = document.querySelector(`.image-cell img[alt='${imageName}']`).parentElement;
        const counter = cell.querySelector('.counter');
        counter.textContent = state.bets[imageName];
    });

    if (state.totalCounter === MAX_BETS) {
        disableUnselected();
        spinButton.classList.remove('disabled');
    }

    console.log(state);
}

function disableUnselected() {
    document.querySelectorAll('.image-cell').forEach(cell => {
        const counter = parseInt(cell.querySelector('.counter').textContent, 10);
        if (counter === 0) {
            cell.classList.add('disabled');
        }
    });
}

function spin() {
    if (state.spinning) return;
    state.spinning = true;
    spinButton.classList.add('disabled');
    resetButton.classList.add('disabled');
    let spins = 0;
    const interval = setInterval(() => {
        if (spins >= TOTAL_SPINS) {
            clearInterval(interval);
            resetButton.classList.remove('disabled');
            state.spinning = false;
            setResults();
            checkResult();
        } else {
            spins++;
            randomizeBoard();
        }
    }, SPIN_INTERVAL);
}

function randomizeBoard() {
    const images = Object.keys(state.bets);
    document.querySelectorAll('#resultBoard div').forEach(cell => {
        const randomImage = images[Math.floor(Math.random() * images.length)];
        cell.innerHTML = `<img src="${randomImage}.png" alt="${randomImage}" width="${IMAGE_SIZE}">`;
    });
}

function setResults() {
    const results = Array.from(document.querySelectorAll('#resultBoard div img')).map(img => img.alt);
    state.results = results.reduce((acc, result) => {
        acc[result] = (acc[result] || 0) + 1;
        return acc;
    }, {
        bau: 0,
        cua: 0,
        tom: 0,
        ca: 0,
        nai: 0,
        ga: 0,
    });
}

function checkResult() {
    const betCounts = state.bets;
    const resultCounts = state.results;

    let isCorrect = true;
    for (const [key, count] of Object.entries(resultCounts)) {
        if (betCounts[key] !== count) {
            isCorrect = false;
            break;
        }
    }

    const filteredResults = Object.entries(betCounts)
        .filter(([key, count]) => count > 0)
        .map(([key, count]) => `${NAME_MAPPING[key]}: ${count}`);

    if (isCorrect) {
        console.log(`Bạn đã đoán đúng với kết quả: ${filteredResults.join(', ')}`);
    } else {
        console.log(`Bạn đã đoán sai với kết quả: ${filteredResults.join(', ')}`);
    }
}

function resetGame() {
    Object.keys(state.bets).forEach(key => state.bets[key] = 0);
    state.totalCounter = 0;
    updateBets();
    document.querySelectorAll('.image-cell').forEach(cell => {
        cell.classList.remove('disabled');
    });
}

spinButton.addEventListener('click', spin);
resetButton.addEventListener('click', resetGame);