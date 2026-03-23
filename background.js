const FOCUS_TIME = 1500;

let isRunning = false;
let timeLeft = FOCUS_TIME;
let timerId = null;

function sendTimerUpdate() {
  chrome.runtime.sendMessage({
    action: "updateDisplay",
    timeLeft: timeLeft,
    timerRunning: isRunning
  });
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function startTimer() {
  stopTimer();
  isRunning = true;

  timerId = setInterval(function () {
    timeLeft -= 1;

    if (timeLeft <= 0) {
      stopTimer();
      isRunning = false;
      timeLeft = FOCUS_TIME;
    }

    sendTimerUpdate();
  }, 1000);

  sendTimerUpdate();
}

function pauseTimer() {
  isRunning = false;
  stopTimer();
  sendTimerUpdate();
}

function restartTimer() {
  isRunning = false;
  stopTimer();
  timeLeft = FOCUS_TIME;
  sendTimerUpdate();
}

function addSite(site) {
  chrome.storage.local.get(["blockedSites"], function (result) {
    const blockedSites = result.blockedSites || [];

    if (blockedSites.includes(site)) {
      return;
    }

    blockedSites.push(site);
    chrome.storage.local.set({ blockedSites: blockedSites });

    chrome.runtime.sendMessage({
      action: "siteAdded",
      site: site
    });
  });
}

function deleteSite(siteToDelete) {
  chrome.storage.local.get(["blockedSites"], function (result) {
    const blockedSites = (result.blockedSites || []).filter(function (site) {
      return site !== siteToDelete;
    });

    chrome.storage.local.set({ blockedSites: blockedSites });

    chrome.runtime.sendMessage({
      action: "siteDeleted",
      site: siteToDelete
    });
  });
}

chrome.runtime.onMessage.addListener(function (message) {
  if (message.action === "startTimer") {
    startTimer();
  }

  if (message.action === "stopTimer") {
    pauseTimer();
  }

  if (message.action === "restartTimer") {
    restartTimer();
  }

  if (message.action === "getTimerStatus") {
    sendTimerUpdate();
  }

  if (message.action === "addSite") {
    addSite(message.site);
  }

  if (message.action === "deleteSite") {
    deleteSite(message.site);
  }
});
