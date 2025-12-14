// Initialize variables
let startTime, endTime;
let isTypingStarted = false;
let correctText = "";
let timerInterval;
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
let inputField = document.getElementById("typingInput");
let timerDisplay = document.getElementById("timer");
let feedbackDisplay = document.getElementById("feedback");
let leaderboardContainer = document.getElementById("leaderboard");
let instructionText = document.getElementById("instruction");
let gameModeSelector = document.getElementById("gameMode");
let startButton = document.getElementById("startButton");
let playArea = document.getElementById("play-area");
let typedTextDiv = document.getElementById("typedText");
let restartButton = document.getElementById("restartButton");
let gameModeContainer = document.getElementById("gameModeSelector");
let nicknameContainer = document.getElementById("nickname-container");
let nicknameInput = document.getElementById("nicknameInput");
let submitNicknameButton = document.getElementById("submitNickname");

// Enable the start button once a game mode is selected
gameModeSelector.addEventListener("change", function () {
    if (gameModeSelector.value !== "") {
        startButton.disabled = false;  
        startButton.classList.add("enabled");  
    } else {
        startButton.disabled = true;  
        startButton.classList.remove("enabled");  
    }
});

// Event listener to start the game
startButton.addEventListener("click", function () {
    updateCorrectText(); // Update the correct text based on selected game mode
    playArea.style.display = 'block'; 
    gameModeContainer.style.display = 'none'; 
    instructionText.style.display = 'none'; 
    startButton.style.display = 'none'; 
    typedTextDiv.innerHTML = createGrayText(); 
    inputField.disabled = false; 
    inputField.focus(); 
});

// Function to create the alphabet in gray
function createGrayText() {
    let grayText = "";
    for (let i = 0; i < correctText.length; i++) {
        grayText += `<span class="letter" style="color: gray;">${correctText[i]}</span>`;
    }
    return grayText;
}

// Event listener for typing
inputField.addEventListener("input", function () {
    if (!isTypingStarted) {
        startTimer(); 
        isTypingStarted = true;
    }

    let typedText = inputField.value;
    let highlightedText = ''; 

    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === correctText[i]) {
            highlightedText += `<span class="letter correct">${typedText[i]}</span>`; 
        } else {
            highlightedText += `<span class="letter incorrect">${typedText[i]}</span>`; 
        }
    }

    typedTextDiv.innerHTML = highlightedText + createGrayText().slice(typedText.length); 

    if (typedText === correctText) {
        stopTimer();
        feedbackDisplay.innerHTML = "Correct! Well done!";
        instructionText.innerHTML = "You can restart the game anytime by pressing Shift + Enter.";
        restartButton.style.display = 'block'; 
        nicknameContainer.style.display = 'block'; 
    }
});

// Timer functions
function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 100);
}

function updateTimer() {
    let elapsedTime = ((new Date() - startTime) / 1000).toFixed(2);
    timerDisplay.textContent = "Time: " + elapsedTime + "s";
}

function stopTimer() {
    clearInterval(timerInterval);
}

function updateCorrectText() {
    let gameMode = gameModeSelector.value;
    switch (gameMode) {
        case 'classic':
            correctText = "abcdefghijklmnopqrstuvwxyz";
            break;
        case 'spaces':
            correctText = "a b c d e f g h i j k l m n o p q r s t u v w x y z";
            break;
        case 'backwards':
            correctText = "zyxwvutsrqponmlkjihgfedcba";
            break;
        case 'backwards-spaces':
            correctText = "z y x w v u t s r q p o n m l k j i h g f e d c b a";
            break;
        default:
            correctText = "";
    }
}

// Event listener for the restart button (without reload)
restartButton.addEventListener("click", function () {
    resetGame();  
});

function resetGame() {
    isTypingStarted = false;
    inputField.value = "";
    typedTextDiv.innerHTML = "";
    feedbackDisplay.innerHTML = "";
    timerDisplay.textContent = "Time: 0.00s";
    restartButton.style.display = 'none';
    nicknameContainer.style.display = 'none';
    instructionText.style.display = 'block';
    gameModeContainer.style.display = 'block';
    startButton.style.display = 'block';
    startButton.disabled = true;
    startButton.classList.remove("enabled");
}

// Event listener for the nickname submission
submitNicknameButton.addEventListener("click", function () {
    let nickname = nicknameInput.value.trim();
    if (nickname === "") {
        alert("Please enter a nickname!");
        return;
    }

    let gameMode = gameModeSelector.value;
    let timeTaken = ((new Date() - startTime) / 1000).toFixed(2);

    let score = {
        nickname: nickname,
        time: timeTaken,
        gameMode: gameMode,
        timestamp: new Date().toISOString()
    };

    leaderboard.push(score);
    leaderboard.sort((a, b) => a.time - b.time);

    leaderboard = leaderboard.slice(0, 20);

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

    nicknameContainer.style.display = 'none';
    updateLeaderboard(); 
});

// Update leaderboard display
function updateLeaderboard() {
    leaderboardContainer.innerHTML = "<h3>Leaderboard</h3>";
    leaderboard.forEach((entry, index) => {
        let leaderboardEntry = document.createElement("div");
        leaderboardEntry.textContent = `${index + 1}. ${entry.nickname} - ${entry.time}s - ${entry.gameMode} (${formatTimestamp(entry.timestamp)})`;
        leaderboardContainer.appendChild(leaderboardEntry);
    });
}

function formatTimestamp(timestamp) {
    const diff = new Date() - new Date(timestamp);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    const months = Math.floor(diff / 2628000000);

    if (months > 0) return `${months} month(s) ago`;
    if (days > 0) return `${days} day(s) ago`;
    if (hours > 0) return `${hours} hour(s) ago`;
    if (minutes > 0) return `${minutes} minute(s) ago`;
    return `${seconds} second(s) ago`;
}

// Initial leaderboard render
updateLeaderboard();
