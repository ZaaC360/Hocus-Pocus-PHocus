let startBtn = document.querySelector("#startBtn");
let restartBtn = document.querySelector("#restartBtn");
let siteInput = document.querySelector("#siteInput");
let addSiteBtn = document.querySelector("#addSiteBtn");
let blockedSitesList = document.querySelector("#blockedSitesList");
let timerDisplay = document.querySelector("#timerDisplay");

let timerRunning = false;


startBtn.addEventListener("click", () => {
    timerRunning = !timerRunning; 
    
    if (timerRunning) {
        startBtn.textContent = "Stop Focus";
        timerInterval = setInterval(updateTimer, 1000);
    } else {
        startBtn.textContent = "Start Focus";
        clearInterval(timerInterval);
    }
});

addSiteBtn.addEventListener("click", () => {
    let siteName = siteInput.value;
    
    if (siteName.trim() === "") {
        return;
    }
    
    let newItem = document.createElement("li");
    newItem.innerHTML = `${siteName} <button class="deleteBtn">×</button>`;
    blockedSitesList.appendChild(newItem);
    siteInput.value = "";
    addDeleteListener();
});

function addDeleteListener() {
    let deleteButtons = document.querySelectorAll(".deleteBtn");
    deleteButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.target.parentElement.remove(); 
        });
    });
}

let timeLeft = 1500;
let timerInterval = null;

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;
    
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function updateTimer() {
    timeLeft--;

    timerDisplay.textContent = formatTime(timeLeft);

    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timerRunning = false;
        startBtn.textContent = "Start Focus";
    }
}

restartBtn.addEventListener("click", () => {
    clearInterval(timerInterval);

    timeLeft = 1500;
    timerDisplay.textContent = formatTime(timeLeft);
    timerRunning = false;
    startBtn.textContent = "Start Focus";
});