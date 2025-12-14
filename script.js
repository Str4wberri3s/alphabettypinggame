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

// Enable the start button once a game mode is selected
gameModeSelector.addEventListener("change", function() {
    startButton.disabled = false;  // Enable the button when a mode is selected
});

// Event listener to start the game
startButton.addEventListener("click", function () {
    updateCorrectText(); // Update the correct text based on selected game mode
    playArea.style.display = 'block'; // Show the game area
    instructionText.style.display = 'none'; // Hide the instructions
    startButton.style.display = 'none'; // Hide the start button and game mode selection
});

// Event listener for typing
inputField.addEventListener("input", function () {
    if (!isTypingStarted) {
        startTimer();
        isTypingStarted = true;
    }

    let typedText = inputField.value;

    let highlightedText = ''; // Initialize highlighted text to hold the colored characters
    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === correctText[i]) {
            highlightedText += `<span style="color: black;">${typedText[i]}</span>`; // Correct letter stays black
        } else {
            highlightedText += `<span style="color: red;">${typedText[i]}</span>`; // Incorrect letter turns red
        }
    }

    inputField.innerHTML = highlightedText; // Update input field with colored text

    // Check if the typed text matches the full correct text
    if (typedText === correctText) {
        stopTimer();
        feedbackDisplay.innerHTML = "Correct! Well done!";
        instructionText.innerHTML = "You can restart the game anytime by pressing Shift + Enter.";
        promptForNickname();
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

// Handle nickname input
function promptForNickname() {
    let nickname = prompt("Enter your nickname:");

    if (nickname) {
        let timeTaken = parseFloat(timerDisplay.textContent.replace('Time: ', '').replace('s', ''));
        let gameMode = getSelectedGameMode();
        let timestamp = formatTimestamp(new Date());

        let newEntry = {
            nickname,
            time: timeTaken,
            gameMode,
            timestamp,
        };

        leaderboard.push(newEntry);
        leaderboard.sort((a, b) => a.time - b.time); // Sort by fastest time
        if (leaderboard.length > 20) leaderboard.pop(); // Keep only top 20

        localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
        displayLeaderboard();
    }
}

// Format timestamp to relative time
function formatTimestamp(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);

    if (diffInSeconds < 60) return `${diffInSeconds} second${diffInSeconds === 1 ? '' : 's'} ago`;
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    if (diffInDays < 30) return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
}

// Display the leaderboard
function displayLeaderboard() {
    leaderboardContainer.innerHTML = '';
    leaderboard.forEach(entry => {
        let div = document.createElement('div');
        div.innerHTML = `${entry.nickname} | ${entry.time.toFixed(2)}s | ${entry.gameMode} | ${entry.timestamp}`;
        leaderboardContainer.appendChild(div);
    });
}

// Game mode selection
function getSelectedGameMode() {
    return gameModeSelector.value; // Get the selected game mode
}

// Adjust correct text based on selected game mode
function updateCorrectText() {
    let mode = gameModeSelector.value;

    if (mode === "classic") {
        correctText = "abcdefghijklmnopqrstuvwxyz";
    } else if (mode === "spaces") {
        correctText = "a b c d e f g h i j k l m n o p q r s t u v w x y z";
    } else if (mode === "backwards") {
        correctText = "zyxwvutsrqponmlkjihgfedcba";
    } else if (mode === "backwards-spaces") {
        correctText = "z y x w v u t s r q p o n m l k j i h g f e d c b a";
    }
}

// Display leaderboard on load
displayLeaderboard();

// Restart game functionality using Shift + Enter
document.addEventListener('keydown', function (event) {
    if (event.shiftKey && event.key === 'Enter') {
        resetGame();
    }
});

// Reset the game
function resetGame() {
    inputField.value = '';
    feedbackDisplay.innerHTML = '';
    timerDisplay.textContent = "Time: 0.00s";
    instructionText.innerHTML = "Select a game mode and start typing!";
    instructionText.style.display = 'block';
    playArea.style.display = 'none';
    startButton.style.display = 'inline-block';
    startButton.disabled = true; // Disable button
