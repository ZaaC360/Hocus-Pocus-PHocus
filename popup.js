const FOCUS_DURATION = 1500;

const startBtn = document.querySelector("#startBtn");
const restartBtn = document.querySelector("#restartBtn");
const timerDisplay = document.querySelector("#timerDisplay");
const timerStatus = document.querySelector("#timerStatus");
const siteInput = document.querySelector("#siteInput");
const addSiteBtn = document.querySelector("#addSiteBtn");
const blockedSitesList = document.querySelector("#blockedSitesList");
const emptyState = document.querySelector("#emptyState");

let timerRunning = false;
let currentTimeLeft = FOCUS_DURATION;

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

function setTimerState(isRunning, timeLeft = currentTimeLeft) {
  timerRunning = isRunning;
  currentTimeLeft = timeLeft;

  const hasStarted = currentTimeLeft < FOCUS_DURATION;
  let statusText = "Not started";
  let statusClass = "status-idle";

  if (timerRunning) {
    statusText = "Running";
    statusClass = "status-running";
  } else if (hasStarted) {
    statusText = "Paused";
    statusClass = "status-paused";
  }

  timerStatus.textContent = statusText;
  timerStatus.className = `status-badge ${statusClass}`;
  startBtn.textContent = timerRunning ? "Pause Focus" : "Start Focus";
  startBtn.classList.toggle("is-running", timerRunning);
}

function updateEmptyState() {
  emptyState.hidden = blockedSitesList.children.length > 0;
}

function createSiteItem(site) {
  const listItem = document.createElement("li");
  listItem.className = "site-pill";

  const siteLabel = document.createElement("span");
  siteLabel.textContent = site;

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "deleteBtn";
  deleteBtn.setAttribute("aria-label", `Remove ${site}`);
  deleteBtn.textContent = "×";
  deleteBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({
      action: "deleteSite",
      site
    });
  });

  listItem.append(siteLabel, deleteBtn);
  return listItem;
}

function renderBlockedSites(sites) {
  blockedSitesList.innerHTML = "";
  sites.forEach((site) => {
    blockedSitesList.appendChild(createSiteItem(site));
  });
  updateEmptyState();
}

startBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({
    action: timerRunning ? "stopTimer" : "startTimer"
  });
});

restartBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "restartTimer" });
});

addSiteBtn.addEventListener("click", () => {
  const siteName = siteInput.value.trim();

  if (!siteName) {
    siteInput.focus();
    return;
  }

  chrome.runtime.sendMessage({
    action: "addSite",
    site: siteName
  });

  siteInput.value = "";
});

siteInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addSiteBtn.click();
  }
});

chrome.runtime.sendMessage({ action: "getTimerStatus" });

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "updateDisplay") {
    currentTimeLeft = message.timeLeft;
    timerDisplay.textContent = formatTime(message.timeLeft);
    setTimerState(Boolean(message.timerRunning), message.timeLeft);
  }

  if (message.action === "siteAdded") {
    const duplicate = Array.from(blockedSitesList.children).some((item) => {
      const label = item.querySelector("span");
      return label && label.textContent === message.site;
    });

    if (!duplicate) {
      blockedSitesList.appendChild(createSiteItem(message.site));
    }
    updateEmptyState();
  }

  if (message.action === "siteDeleted") {
    const listItems = blockedSitesList.querySelectorAll("li");
    listItems.forEach((item) => {
      const label = item.querySelector("span");
      if (label && label.textContent === message.site) {
        item.remove();
      }
    });
    updateEmptyState();
  }
});

chrome.storage.local.get(["blockedSites"], (result) => {
  renderBlockedSites(result.blockedSites || []);
});

setTimerState(false, FOCUS_DURATION);
