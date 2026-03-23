let timerRunning = false;
let timeLeft = 1500;
let timerInterval = null;

function broadcastTimer() {
  chrome.runtime.sendMessage({
    action: "updateDisplay",
    timeLeft,
    timerRunning
  });
}

function stopActiveTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateTimer() {
  timeLeft -= 1;
  broadcastTimer();

  if (timeLeft <= 0) {
    stopActiveTimer();
    timerRunning = false;
    timeLeft = 1500;
    broadcastTimer();
  }
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "startTimer") {
    stopActiveTimer();
    timerRunning = true;
    timerInterval = setInterval(updateTimer, 1000);
    broadcastTimer();
  }

  if (message.action === "stopTimer") {
    timerRunning = false;
    stopActiveTimer();
    broadcastTimer();
  }

  if (message.action === "restartTimer") {
    timerRunning = false;
    stopActiveTimer();
    timeLeft = 1500;
    broadcastTimer();
  }

  if (message.action === "getTimerStatus") {
    broadcastTimer();
  }

  if (message.action === "addSite") {
    const newSite = message.site;

    chrome.storage.local.get(["blockedSites"], (result) => {
      const sites = result.blockedSites || [];

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

  if (message.action === "deleteSite") {
    const siteToDelete = message.site;

    chrome.storage.local.get(["blockedSites"], (result) => {
      let sites = result.blockedSites || [];
      sites = sites.filter((site) => site !== siteToDelete);

      chrome.storage.local.set({ blockedSites: sites });
      chrome.runtime.sendMessage({
        action: "siteDeleted",
        site: siteToDelete
      });
    });
  }
});
