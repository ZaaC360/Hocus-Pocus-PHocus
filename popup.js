let startBtn = document.querySelector("#startBtn");
let restartBtn = document.querySelector("#restartBtn");
let timerDisplay = document.querySelector("#timerDisplay");
let siteInput = document.querySelector("#siteInput");
let addSiteBtn = document.querySelector("#addSiteBtn");
let blockedSitesList = document.querySelector("#blockedSitesList");
let timerRunning = false;

startBtn.addEventListener("click", () => {
    timerRunning = !timerRunning;
    
    if (timerRunning) {
        startBtn.textContent = "Stop Focus";
        chrome.runtime.sendMessage({action: "startTimer"});
    } else {
        startBtn.textContent = "Start Focus";
        chrome.runtime.sendMessage({action: "stopTimer"});
    }
});

addSiteBtn.addEventListener("click", () => {
    let siteName = siteInput.value;
    
    if (siteName.trim() === "") {
        alert("Please enter a site");
        return;
    }
    chrome.runtime.sendMessage({
        action: "addSite",
        site: siteName
    });
    
    siteInput.value = "";  // Clear input
});


function addDeleteListener() {
    let deleteButtons = document.querySelectorAll(".deleteBtn");
    deleteButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            let listItem = e.target.parentElement;
            let siteName = listItem.textContent.replace(" ×", "");  // Get site name
            
            // SEND MESSAGE to background.js
            chrome.runtime.sendMessage({
                action: "deleteSite",
                site: siteName
            });
        });
    });
}

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;
    
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}


restartBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({action: "restartTimer"});
    timerDisplay.textContent = formatTime(1500);
    timerRunning = false;
    startBtn.textContent = "Start Focus";
});

chrome.runtime.onMessage.addListener((message, sender, response) => {
    
    if (message.action === "updateDisplay") {
        timerDisplay.textContent = formatTime(message.timeLeft);
    }

     if (message.action === "siteAdded") {
        let newItem = document.createElement("li");
        newItem.innerHTML = `${message.site} <button class="deleteBtn">×</button>`;
        blockedSitesList.appendChild(newItem);
        addDeleteListener();
    }
    

    if (message.action === "siteDeleted") {
        let listItems = document.querySelectorAll("#blockedSitesList li");
        listItems.forEach(item => {
            if (item.textContent.includes(message.site)) {
                item.remove();
            }
        });
    }
    
});
    


chrome.storage.local.get(['blockedSites'], (result) => {
    let sites = result.blockedSites || [];
    blockedSitesList.innerHTML = '';
    sites.forEach(site => {
        let newItem = document.createElement("li");
        newItem.innerHTML = `${site} <button class="deleteBtn">×</button>`;
        blockedSitesList.appendChild(newItem);
    });
    addDeleteListener();
});