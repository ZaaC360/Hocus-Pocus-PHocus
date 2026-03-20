let timerRunning = false;
let timeLeft = 1500;  // 25 minutes
let timerInterval = null;

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function updateTimer() {
    timeLeft--;

    chrome.runtime.sendMessage({
        action: "updateDisplay",
        timeLeft: timeLeft
    });
    
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timerRunning = false;
        timeLeft = 1500;
    }
}

chrome.runtime.onMessage.addListener((message, sender, response) => {
    
    if (message.action === "startTimer") {
        timerRunning = true;
        timerInterval = setInterval(updateTimer, 1000);
    }
    
    if (message.action === "stopTimer") {
        timerRunning = false;
        clearInterval(timerInterval);
    }
    
    if (message.action === "restartTimer") {
        clearInterval(timerInterval);
        timeLeft = 1500;
        timerRunning = false;
    }

    // addSite

    if (message.action === "addSite") {
    let newSite = message.site;

    chrome.storage.local.get(['blockedSites'], (result) => {
        let sites = result.blockedSites || [];  
      
        if (!sites.includes(newSite)) {
            sites.push(newSite);  

            chrome.storage.local.set({ blockedSites: sites });

            chrome.runtime.sendMessage({
                action: "siteAdded",
                site: newSite
            });
        }
    });
}


// Delete Site

if (message.action === "deleteSite") {
    let siteToDelete = message.site;
    
    chrome.storage.local.get(['blockedSites'], (result) => {
        let sites = result.blockedSites || [];
        sites = sites.filter(site => site !== siteToDelete);

        chrome.storage.local.set({ blockedSites: sites });
        chrome.runtime.sendMessage({
            action: "siteDeleted",
            site: siteToDelete
        });
    });
}

    
});