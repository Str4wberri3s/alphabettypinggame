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
let nicknameInput = document.getElementBy
let nicknameInput = document.getElementById("nicknameInput");
let submitNicknameButton = document.getElementById("submitNickname");

// Enable the start button once a game mode is selected
gameModeSelector.addEventListener("change", function () {
    if (gameModeSelector.value !== "") {
        startButton.disabled = false;  // Enable the button when a mode is selected
        startButton.classList.add("enabled");  // Change button color to green
    } else {
        startButton.disabled = true;  // Keep the button disabled if no mode is selected
        startButton.classList.remove("enabled");  // Revert button color to gray
    }
});

// Event listener to start the game
startButton.addEventListener("click", function () {
    updateCorrectText(); // Update the correct text based on selected game mode
    playArea.style.display = 'block'; // Show the game area
    gameModeContainer.style.display = 'none'; // Hide the game mode selection
    instructionText.style.display = 'none'; // Hide the instructions
    startButton.style.display = 'none'; // Hide the start button
    typedTextDiv.innerHTML = ''; // Clear the text before starting
    inputField.disabled = false; // Enable typing input
    inputField.focus(); // Focus the input field immediately
    startTimer(); // Start the timer when game begins
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
            highlightedText += `<span style="color: green;">${typedText[i]}</span>`; // Correct letter turns green
        } else {
            highlightedText += `<span style="color: red;">${typedText[i]}</span>`; // Incorrect letter turns red
        }
    }

    typedTextDiv.innerHTML = highlightedText; // Display highlighted text in the div

    // Check if the typed text matches the full correct text
    if (typedText === correctText) {
        stopTimer();
        feedbackDisplay.innerHTML = "Correct! Well done!";
        instructionText.innerHTML = "You can restart the game anytime by pressing Shift + Enter.";
        restartButton.style.display = 'block'; // Show the restart button
        
        // Now, show the nickname input form
        nicknameContainer.style.display = 'block'; // Show the nickname container
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

// Event listener for the restart button
restartButton.addEventListener("click", function () {
    location.reload();  // Reload the page, which will reset the game and bring back the game mode selector
});

// Event listener for the nickname submission
submitNicknameButton.addEventListener("click", function () {
    let nickname = nicknameInput.value.trim();
    if (nickname === "") {
        alert("Please enter a nickname!");
        return;
    }

    let gameMode = gameModeSelector.value;
    let timeTaken = ((new Date() - startTime) / 1000).toFixed(2);
    
    // Save the user's score to leaderboard
    let score = {
        nickname: nickname,
        time: timeTaken,
        gameMode: gameMode,
        timestamp: new Date().toISOString()
    };

    leaderboard.push(score);
    leaderboard.sort((a, b) => a.time - b.time);  // Sort by time (ascending)

    // Limit to top 20 leaderboard
    leaderboard = leaderboard.slice(0, 20);

    // Save leaderboard to localStorage
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

    // Hide nickname input and restart game
    nicknameContainer.style.display = 'none';
    updateLeaderboard();  // Refresh the leaderboard
});

// Update leaderboard display
function updateLeaderboard() {
    leaderboardContainer.innerHTML = "";
    leaderboard.forEach((entry, index) => {
        let leaderboardEntry = document.createElement("div");
        leaderboardEntry.textContent = `${index + 1}. ${entry.nickname} - ${entry.time}s - ${entry.gameMode} (${formatTimestamp(entry.timestamp)})`;
        leaderboardContainer.appendChild(leaderboardEntry);
    });
}

// Format timestamp to show time like "1 second ago", "1 minute ago", etc.
function formatTimestamp(timestamp) {
    const diff = new Date() - new Date(timestamp);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    const months = Math.floor(diff / 2628000000); // Roughly 30 days per month

    if (months > 0) return `${months} month(s) ago`;
    if (days > 0) return `${days} day(s) ago`;
    if (hours > 0) return `${hours} hour(s) ago`;
    if (minutes > 0) return `${minutes} minute(s) ago`;
    return `${seconds} second(s) ago`;
}

// Initial leaderboard render
updateLeaderboard();
