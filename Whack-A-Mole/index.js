// DOM Elements
const scoreDisplay = document.querySelector('#score');
const timeLeftDisplay = document.querySelector('#timeLeft');
const maxScoreDisplay = document.querySelector('#maxScore');
const startBtn = document.querySelector('#startBtn');
const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const messageDisplay = document.querySelector('#message');

// EXTRA DISPLAYS (Task 5, 7, 8)
const hitDisplay = document.querySelector('#hits');
const lastGameDisplay = document.querySelector('#lastGame');
const fastestDisplay = document.querySelector('#fastest');

// Variables
let score = 0;
let hits = 0;            // ✔ Task 5
let time = 30;
let bestScore = 0;
let playGame = false;
let gameId = null;

let moleStartTime = 0;   


function webLoad() {
    onLoad();
    showSessionData();
    displayContent();
}


function onLoad() {
    let temp = localStorage.getItem('highScoreMole');
    bestScore = temp ? parseInt(temp) : 0;
}

function showSessionData() {
    let lastScore = sessionStorage.getItem("lastScore");
    lastGameDisplay.textContent = lastScore ? `Last Game: ${lastScore}` : "Last Game: -";

    let fastest = sessionStorage.getItem("fastestHit");
    fastestDisplay.textContent = fastest ? `Fastest Hit: ${fastest}ms` : "Fastest Hit: -";
}




function displayContent() {
    scoreDisplay.textContent = score;
    timeLeftDisplay.textContent = time;
    maxScoreDisplay.textContent = bestScore;
    hitDisplay.textContent = `Hits: ${hits}`;
}



function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomHole() {
    return holes[Math.floor(Math.random() * holes.length)];
}




function popGame() {

    let timer = (time < 10) ? randomTime(300, 800) : randomTime(600, 1500);

    let hole = randomHole();
    let mole = hole.querySelector('.mole');

    if (playGame) {
        mole.classList.add('up');


        moleStartTime = Date.now();

        setTimeout(() => {
            mole.classList.remove('up');
            popGame();
        }, timer);
    }
}



function startGame() {
    time = 30;
    score = 0;
    hits = 0;
    playGame = true;


    startBtn.textContent = "Play Again";
    startBtn.disabled = true;


    sessionStorage.removeItem("lastScore");
    lastGameDisplay.textContent = "Last Game: -";

    messageDisplay.textContent = "⚡ Game Started! Whack the Moles!";

    popGame();

    gameId = setInterval(() => {
        time--;
        displayContent();

        if (time === 0) {
            endGame();
        }
    }, 1000);
}



function endGame() {
    clearInterval(gameId);
    playGame = false;
    startBtn.disabled = false;


    sessionStorage.setItem("lastScore", score);
    lastGameDisplay.textContent = `Last Game: ${score}`;

    if (score > bestScore) {
        localStorage.setItem('highScoreMole', score);
        bestScore = score;

        messageDisplay.textContent = `🏆 NEW RECORD! Score: ${score}`;

        maxScoreDisplay.style.textShadow = "0 0 15px yellow";
        setTimeout(() => maxScoreDisplay.style.textShadow = "none", 1000);
    } else {
        messageDisplay.textContent = `💥 Game Over! You scored ${score}!`;
    }

    score = 0;
    hits = 0;
    displayContent();
}


function bonk(event) {
    if (!event.isTrusted || !playGame) return;

    if (event.target.classList.contains('up')) {

        
        event.target.classList.remove('up');

        event.target.classList.add('bonked');

        setTimeout(() => event.target.classList.remove('bonked'), 200);

        
        score++;
        hits++;

        
        messageDisplay.textContent = "Whack!";
        setTimeout(() => messageDisplay.textContent = "", 300);

        
        if (score > 50) {
            scoreDisplay.style.color = "gold";
        } else {
            scoreDisplay.style.color = "white";
        }


        let timeTaken = Date.now() - moleStartTime;
        let oldFastest = sessionStorage.getItem("fastestHit");

        if (!oldFastest || timeTaken < oldFastest) {
            sessionStorage.setItem("fastestHit", timeTaken);
            fastestDisplay.textContent = `Fastest Hit: ${timeTaken}ms`;
        }

        displayContent();
    }
}

webLoad();

moles.forEach(m => m.addEventListener('click', bonk));
startBtn.addEventListener('click', startGame);
function glowEffect(element) {
    element.classList.add("glow");
    setTimeout(() => element.classList.remove("glow"), 300);
}

glowEffect(document.querySelector("#hits"));
