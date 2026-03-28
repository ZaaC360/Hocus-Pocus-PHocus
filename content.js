
chrome.runtime.onMessage.addListener((message, sender, response) => {
    
    if (message.action === "blockPage") {
         if (document.getElementById("phocus-blocker")) {
            return;
        }

        let overlay = document.createElement("div");
        overlay.id = "phocus-blocker";
        overlay.innerHTML = `
            <div class="phocus-message">
                <h1>Stay Phocused !</h1>
                <p>You are in phocus mode.</p>
                <div class="phocus-timer">25:00</div>
            </div>
        `;
        document.body.appendChild(overlay);
    }
    
    if (message.action === "updateDisplay") {
        // Update timer in blocker overlay
        let timerElement = document.querySelector(".phocus-timer");
        if (timerElement) {
            timerElement.textContent = formatTime(message.timeLeft);
        }
    }
    
});