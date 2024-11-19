class PomodoroTimer {
    constructor() {
        // Timer settings
        this.studyDuration = 25 * 60; // 25 minutes in seconds
        this.breakDuration = 5 * 60; // 5 minutes in seconds
        this.secondsRemaining = this.studyDuration;

        // Timer state
        this.isPlaying = false;
        this.isStudyMode = true;

        // HTML Elements
        this.timerEl = document.querySelector(".timer");
        this.headingEl = document.querySelector(".modeHeader");
        this.startBtn = document.getElementById("start-button");
        this.skipBtn = document.getElementById("skip-button");
        this.studyInput = document.getElementById("studyInput");
        this.breakInput = document.getElementById("breakInput");

        // Event Listeners
        this.startBtn.addEventListener("click", () => this.toggleTimer());
        this.skipBtn.addEventListener("click", () => this.skip());
        this.studyInput.addEventListener("change", () => this.updateDuration("study"));
        this.breakInput.addEventListener("change", () => this.updateDuration("break"));

        // Initialize timer display
        this.updateTimerDisplay();
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / (60 * 60));
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hours > 0) {
            return `${hours.toString()}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
        }
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }

    updateTimerDisplay() {
        this.timerEl.textContent = this.formatTime(this.secondsRemaining);
    }

    updateDuration(mode) {
        const inputElement = mode === "study" ? this.studyInput : this.breakInput;
        const value = parseFloat(inputElement.value); // Parse the input as a float first

        // Check if the value is a valid integer and within the range
        if (Number.isInteger(value) && value > 0 && value <= 999) {
            const durationInSeconds = value * 60;

            if (mode === "study") {
                this.studyDuration = durationInSeconds;
                if (this.isStudyMode) this.resetTimer(this.studyDuration);
            } else {
                this.breakDuration = durationInSeconds;
                if (!this.isStudyMode) this.resetTimer(this.breakDuration);
            }
        } else {
            // Flash the input red
            this.flashInvalidInput(inputElement);

            // Determine the error message
            let errorMessage = "Invalid input. ";
            if (!Number.isInteger(value)) {
                errorMessage += "The value must be a whole number.";
            } else if (value <= 0) {
                errorMessage += "The value must be greater than 0.";
            } else if (value > 999) {
                errorMessage += "The value cannot exceed 999.";
            }

            // Show popup with the error message
            this.showPopup(errorMessage);

            // Reset the input value to the previous valid value
            inputElement.value = mode === "study" ? this.studyDuration / 60 : this.breakDuration / 60;
        }
    }

    showPopup(message) {
        // Clone the popup template
        const template = document.querySelector("#popup-template");
        const popup = template.cloneNode(true);
        popup.classList.remove("hidden");

        // Set the message
        popup.querySelector(".popup-message").textContent = message;

        // Append to the body
        document.body.appendChild(popup);

        // Remove the popup after 3 seconds
        setTimeout(() => {
            popup.remove();
        }, 3000);
    }



    flashInvalidInput(element) {
        // Add the error-flash class
        element.classList.add("error-flash");

        // Remove the class after 1 second
        setTimeout(() => {
            element.classList.remove("error-flash");
        }, 1000);
    }
    resetTimer(duration) {
        this.secondsRemaining = duration;
        this.updateTimerDisplay();
    }

    toggleTimer() {
        if (this.isPlaying) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }

    startTimer() {
        this.isPlaying = true;
        this.startBtn.textContent = "Pause";
        this.interval = setInterval(() => {
            if (this.secondsRemaining > 0) {
                this.secondsRemaining--;
                this.updateTimerDisplay();
            } else {
                this.finishInterval();
            }
        }, 1000);
    }

    pauseTimer() {
        clearInterval(this.interval);
        this.isPlaying = false;
        this.startBtn.textContent = "Start";
    }

    finishInterval() {
        clearInterval(this.interval);
        this.isPlaying = false;
        this.isStudyMode = !this.isStudyMode;
        this.headingEl.textContent = this.isStudyMode ? "Study" : "Break";
        this.resetTimer(this.isStudyMode ? this.studyDuration : this.breakDuration);
    }

    skip() {
        this.finishInterval();
    }
}

// Initialize the Pomodoro Timer
document.addEventListener("DOMContentLoaded", () => {
    const pomodoroTimer = new PomodoroTimer();
});
