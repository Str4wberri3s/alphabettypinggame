/* Save this as script.js */
let startTime, endTime;
let isTypingStarted = false;
let correctText = "abcdefghijklmnopqrstuvwxyz";  // The correct text to type
let timerInterval;
let inputField = document.getElementById("typingInput");
let timerDisplay = document.getElementById("timer");
let feedbackDisplay = document.getElementById("feedback");
let resetButton = document.getElementById("resetButton");

// Start the timer when the user starts typing
inputField.addEventListener('input', function() {
    if (!isTypingStarted) {
        startTimer();
        isTypingStarted = true;
    }
    
    // Check if the typed text matches the correct text
    if (inputField.value === correctText) {
        stopTimer();
        feedbackDisplay.innerHTML = "Correct! Well done!";
        resetButton.style.display = 'inline-block';
    }
});

// Start the timer
function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 100);
}

// Update the timer display
function updateTimer() {
    let elapsedTime = ((new Date() - startTime) / 1000).toFixed(2);  // Time in seconds
    timerDisplay.textContent = "Time: " + elapsedTime + "s";
}

// Stop the timer
function stopTimer() {
    clearInterval(timerInterval);
}

// Reset the game
function resetGame() {
    inputField.value = '';
    feedbackDisplay.innerHTML = '';
    timerDisplay.textContent = "Time: 0.00s";
    resetButton.style.display = 'none';
    isTypingStarted = false;
}
