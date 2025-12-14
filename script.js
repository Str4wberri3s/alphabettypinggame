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

// Enable the start button once a game mode is selected
gameModeSelector.addEventListener("change", function() {
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
    instructionText.style.display = 'none'; // Hide the instructions
    startButton.style.display = 'none'; // Hide the start button and game mode selection
    typedTextDiv.innerHTML = ''; // Clear the text before starting
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

    typedTextDiv.innerHTML = highlightedText; // Display highlighted text in the div

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

function stopTimer
