
const textDisplay = document.querySelector('#textDisplay');
const typingArea = document.querySelector('#typingArea');
const timerDisplay = document.querySelector('#timer');
const wpmDisplay = document.querySelector('#wpm');
const accuracyDisplay = document.querySelector('#accuracy');
const bestWPMDisplay = document.querySelector('#bestWPM');
const startBtn = document.querySelector('#startBtn');
const resetBtn = document.querySelector('#resetBtn');
const nextSentenceBtn = document.querySelector('#nextSentenceBtn');
const timerButtons = document.querySelectorAll('.timer button');

const lastTestDisplay = document.querySelector('#lastTest'); 
const fastStartDisplay = document.querySelector('#fastStart'); 


const testTexts = [
    "The quick brown fox jumps over the lazy dog. Practice makes perfect when learning to type faster.",
    "Technology has revolutionized the way we communicate and work in the modern digital era.",
    "Typing speed is an essential skill for anyone working with computers in today's workplace."
];


let currentText = '';
let timeLeft = 60;
let timerInterval = null;
let startTime = null;
let isTestActive = false;
let bestWPM = 0;
let pauseTimer = null;               
let firstWordTriggered = false;      
let fastStartTime = null;           
let fastStartSaved = false;        

function webLoad() {
    onLoad();
    displayContent();
}

function onLoad() {
    var temp = sessionStorage.getItem('previousWpm');
    if (temp != null) {
        bestWPM = parseInt(temp);
    }

    
    const last = sessionStorage.getItem('lastWPM');
    if (last !== null) {
        lastTestDisplay.textContent = "Last Test: " + last + " WPM";
    }

    
    const fs = sessionStorage.getItem('fastStart');
    if (fs !== null) fastStartDisplay.textContent = "Fastest Start: " + fs + "s";
}

function displayContent() {
    timerDisplay.textContent = timeLeft;
    bestWPMDisplay.textContent = bestWPM;
}

webLoad();

function endGame() {
    startBtn.disabled = false;
    typingArea.disabled = true;
    clearInterval(timerInterval);

    
    let finalWPM = wpmDisplay.textContent;
    sessionStorage.setItem("lastWPM", finalWPM);
    lastTestDisplay.textContent = "Last Test: " + finalWPM + " WPM";


    timeLeft = 60;
    displayContent();
}

function startGame() {
    startBtn.disabled = true;
    typingArea.disabled = false;
    typingArea.value = '';
    typingArea.focus();
    typingArea.setAttribute('placeholder', 'now you are eligible to write and use the input box');

    firstWordTriggered = false;
    fastStartSaved = false;
    fastStartTime = null;

    currentText = testTexts[Math.floor(Math.random() * testTexts.length)];
    textDisplay.textContent = currentText;

    timerInterval = setInterval(updateTimer, 1000);
    startTime = null;
}

function updateTimer() {
    timeLeft--;

    
    if (timeLeft <= 10) {
        timerDisplay.style.color = "red";
        timerDisplay.style.fontSize = "2.2em";
    }

    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        endGame();
    }
    timerDisplay.textContent = timeLeft;
}

function updateStauts() {
    var typed = typingArea.value;
    var word = typed.trim().split(/\s+/).filter(w => w.length > 0);
    const elapsedTime = (Date.now() - startTime) / 1000 / 60; // in minutes
    wpm = elapsedTime > 0 ? Math.round(word.length / elapsedTime) : 0;
    wpmDisplay.textContent = wpm;

    
    if (wpm > 100) {
        wpmDisplay.style.fontWeight = "bold";
    }

    var currentScore = 0;
    for (var i = 0; i < currentText.length; i++) {
        if (currentText[i] === typed[i]) currentScore++;
    }

    const accuracy = (typed.length > 0) ? Math.floor(currentScore / typed.length * 100) : 0;
    accuracyDisplay.textContent = accuracy;


    if (accuracy === 100) {
        accuracyDisplay.style.color = "green";
    } else {
        accuracyDisplay.style.color = "";
    }
}

function Highlights() {
    var typed = typingArea.value;
    var highlightedText = '';

    for (var i = 0; i < currentText.length; i++) {
        if (i < typed.length) {
            if (currentText[i] === typed[i]) {
                highlightedText += `<span class="correct">${currentText[i]}</span>`;
            } else {
                highlightedText += `<span class="incorrect">${currentText[i]}</span>`;
            }
        } else {
            highlightedText += currentText[i];
        }
    }
    textDisplay.innerHTML = highlightedText;
}

function wordType() {
    var textContent = typingArea.value;

    
    if (startTime == null) startTime = Date.now();


    clearTimeout(pauseTimer);
    pauseTimer = setTimeout(() => {
        accuracyDisplay.textContent = "Keep Typing!";
        accuracyDisplay.style.color = "blue";
    }, 3000);

    
    if (!firstWordTriggered && textContent.includes(" ")) {
        firstWordTriggered = true;
        wpmDisplay.style.fontWeight = "bold";
        setTimeout(() => wpmDisplay.style.fontWeight = "normal", 500);
    }

    
    if (textContent.length === 5 && !fastStartSaved) {
        fastStartSaved = true;
        let timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
        sessionStorage.setItem("fastStart", timeTaken);
        fastStartDisplay.textContent = "Fastest Start: " + timeTaken + "s";
    }

    updateStauts();
    Highlights();
}

function resetGame() {
    clearInterval(timerInterval);
    timeLeft = 60;

    typingArea.value = '';
    typingArea.disabled = true;
    textDisplay.textContent = 'Click Start to begin the test.';

    bestWPMDisplay.textContent = bestWPM;
    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '0';

    startBtn.disabled = false;
}

function saveBestWPM() {
    var currentWPM = parseInt(wpmDisplay.textContent);

    if (currentWPM > bestWPM) {
        bestWPM = currentWPM;
        bestWPMDisplay.textContent = bestWPM;

    
        bestWPMDisplay.style.color = "red";
        bestWPMDisplay.style.fontWeight = "bold";

        sessionStorage.setItem('previousWpm', bestWPM);
    } else {
        bestWPMDisplay.style.color = "";
        bestWPMDisplay.style.fontWeight = "";
    }
}


resetBtn.addEventListener('click', () => {
    saveBestWPM();
    resetGame();
});

timerButtons.forEach(button => {
    button.addEventListener('click', () => {
        timeLeft = parseInt(button.textContent);
        timerDisplay.textContent = timeLeft;
    });
});

nextSentenceBtn.addEventListener('click', function () {
    currentText = testTexts[Math.floor(Math.random() * testTexts.length)];
    textDisplay.textContent = currentText;
    typingArea.value = '';
    typingArea.focus();
    startTime = null;
    updateStauts();
    Highlights();
});

startBtn.addEventListener('click', startGame);
typingArea.addEventListener('input', wordType);

displayContent();
