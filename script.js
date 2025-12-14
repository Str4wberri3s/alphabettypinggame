<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Typing Game</title>
    <style>
        /* Style for the body */
        body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
        }

        /* Center the game area */
        #play-area {
            text-align: center;
            display: none; /* Hidden until the game starts */
        }

        /* Style for the timer */
        #timer {
            font-size: 24px;
            color: gray;
            margin-top: 20px;
        }

        /* Style for the typing box */
        #typedText {
            font-family: 'Courier New', monospace;
            font-size: 18px;
            color: gray;
            padding: 10px;
            margin-top: 20px;
            width: 80%;
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            word-wrap: normal;
        }

        /* Style for the input box */
        #typingInput {
            font-size: 18px;
            padding: 10px;
            width: 80%;
            margin-top: 20px;
            resize: none;
            display: block;
            margin: 0 auto;
        }

        /* Add a style for correct and incorrect text */
        .correct {
            color: green;
        }

        .incorrect {
            color: red;
        }

        .letter {
            display: inline-block;
            width: 20px;  /* Adjust this value to make sure letters fit */
            text-align: center;
        }

        /* Style for buttons and game modes */
        button {
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
        }

        #gameModeSelector {
            margin: 20px;
        }

        /* Style for the leaderboard and nickname input */
        #leaderboard {
            margin-top: 30px;
            width: 80%;
            text-align: left;
            font-size: 16px;
            max-height: 300px;
            overflow-y: scroll;
        }

        /* Hide elements initially */
        #nickname-container {
            display: none;
            margin-top: 20px;
        }
    </style>
</head>
<body>

    <h1>Typing Game</h1>
    
    <!-- Game Mode Selector -->
    <div id="gameModeSelector">
        <select id="gameMode" onchange="updateStartButtonState()">
            <option value="">Select Game Mode</option>
            <option value="classic">Classic (No spaces)</option>
            <option value="spaces">With Spaces</option>
            <option value="backwards">Backwards</option>
            <option value="backwards-spaces">Backwards with Spaces</option>
        </select>
        <button id="startButton" disabled>Start Game</button>
    </div>
    
    <!-- Game area -->
    <div id="play-area">
        <div id="timer">Time: 0.00s</div>
        <div id="typedText"></div>
        <textarea id="typingInput" placeholder="Start typing..." disabled></textarea>
        <div id="feedback"></div>
        <button id="restartButton" style="display: none;">Restart Game</button>
    </div>
    
    <!-- Nickname Form -->
    <div id="nickname-container">
        <input type="text" id="nicknameInput" placeholder="Enter your nickname" />
        <button id="submitNickname">Submit</button>
    </div>

    <!-- Leaderboard -->
    <div id="leaderboard">
        <h3>Leaderboard</h3>
    </div>

    <script>
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
        let gameModeSelector = document.getElementById("gameMode");
        let startButton = document.getElementById("startButton");
        let playArea = document.getElementById("play-area");
        let typedTextDiv = document.getElementById("typedText");
        let restartButton = document.getElementById("restartButton");
        let nicknameContainer = document.getElementById("nickname-container");
        let nicknameInput = document.getElementById("nicknameInput");
        let submitNicknameButton = document.getElementById("submitNickname");

        // Enable the start button once a game mode is selected
        function updateStartButtonState() {
            if (gameModeSelector.value !== "") {
                startButton.disabled = false;  // Enable the button when a mode is selected
            } else {
                startButton.disabled = true;  // Keep the button disabled if no mode is selected
            }
        }

        // Event listener to start the game
        startButton.addEventListener("click", function () {
            updateCorrectText(); // Update the correct text based on selected game mode
            playArea.style.display = 'block'; // Show the game area
            gameModeSelector.style.display = 'none'; // Hide the game mode selection
            startButton.style.display = 'none'; // Hide the start button
            typedTextDiv.innerHTML = createGrayText(); // Display the gray alphabet text initially
            inputField.disabled = false; // Enable typing input
            inputField.focus(); // Focus the input field immediately
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
                startTimer(); // Start the timer when user starts typing
                isTypingStarted = true;
            }

            let typedText = inputField.value;
            let highlightedText = ''; // Initialize highlighted text to hold the colored characters

            // Loop over the typed text to match with the correct text and change color
            for (let i = 0; i < typedText.length; i++) {
                if (typedText[i] === correctText[i]) {
                    highlightedText += `<span class="letter correct">${typedText[i]}</span>`; // Correct letter turns green
                } else {
                    highlightedText += `<span class="letter incorrect">${typedText[i]}</span>`; // Incorrect letter turns red
                }
            }

            // Update the display with the correct/incorrect letters
            typedTextDiv.innerHTML = highlightedText + createGrayText().slice(typedText.length); // Display typed text with colors and remaining gray text

            // Check if the typed text matches the full correct text
            if (typedText === correctText) {
                stopTimer();
                feedbackDisplay.innerHTML = "Correct! Well done!";
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
            leaderboardContainer.innerHTML = "<h3>Leaderboard</h3>";
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
    </script>
</body>
</html>
