const FOCUS_TIME = 1500;

const startBtn = document.querySelector("#startBtn");
const restartBtn = document.querySelector("#restartBtn");
const timerDisplay = document.querySelector("#timerDisplay");
const timerStatus = document.querySelector("#timerStatus");
const siteInput = document.querySelector("#siteInput");
const addSiteBtn = document.querySelector("#addSiteBtn");
const blockedSitesList = document.querySelector("#blockedSitesList");
const emptyState = document.querySelector("#emptyState");

let isRunning = false;
let timeLeft = FOCUS_TIME;

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function updateTimerUI() {
  timerDisplay.textContent = formatTime(timeLeft);

  if (isRunning) {
    timerStatus.textContent = "Running";
    timerStatus.className = "status-badge status-running";
    startBtn.textContent = "Pause Phocus";
    startBtn.classList.add("is-running");
    return;
  }

  if (timeLeft < FOCUS_TIME) {
    timerStatus.textContent = "Paused";
    timerStatus.className = "status-badge status-paused";
  } else {
    timerStatus.textContent = "Not started";
    timerStatus.className = "status-badge status-idle";
  }

  startBtn.textContent = "Start Phocus";
  startBtn.classList.remove("is-running");
}

function updateEmptyState() {
  emptyState.hidden = blockedSitesList.children.length > 0;
}

function deleteSite(site) {
  chrome.runtime.sendMessage({
    action: "deleteSite",
    site: site
  });
}

function createSiteItem(site) {
  const listItem = document.createElement("li");
  listItem.className = "site-pill";
  listItem.dataset.site = site;

  const favicon = document.createElement("img");
  favicon.src = `https://icons.duckduckgo.com/ip3/${site}.ico`;
  favicon.alt = site;
  favicon.title = site;
  favicon.style.width = "24px";
  favicon.style.height = "24px";
  favicon.style.borderRadius = "4px";
  favicon.style.objectFit = "contain";

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.textContent = "×";
  deleteBtn.setAttribute("aria-label", `Remove ${site}`);
  deleteBtn.addEventListener("click", function () {
    deleteSite(site);
  });

  listItem.appendChild(favicon);
  listItem.appendChild(deleteBtn);

  return listItem;
}

function renderSites(sites) {
  blockedSitesList.innerHTML = "";

  sites.forEach(function (site) {
    blockedSitesList.appendChild(createSiteItem(site));
  });

  updateEmptyState();
}

function addSiteToList(site) {
  const existingItem = blockedSitesList.querySelector(`[data-site="${site}"]`);

  if (existingItem) {
    return;
  }

  blockedSitesList.appendChild(createSiteItem(site));
  updateEmptyState();
}

function removeSiteFromList(site) {
  const item = blockedSitesList.querySelector(`[data-site="${site}"]`);

  if (item) {
    item.remove();
  }

  updateEmptyState();
}

startBtn.addEventListener("click", function () {
  chrome.runtime.sendMessage({
    action: isRunning ? "stopTimer" : "startTimer"
  });
});

restartBtn.addEventListener("click", function () {
  chrome.runtime.sendMessage({ action: "restartTimer" });
});

addSiteBtn.addEventListener("click", function () {
  const site = siteInput.value.trim();

  if (!site) {
    siteInput.focus();
    return;
  }

  chrome.runtime.sendMessage({
    action: "addSite",
    site: site
  });

  siteInput.value = "";
});

siteInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addSiteBtn.click();
  }
});

chrome.runtime.onMessage.addListener(function (message) {
  if (message.action === "updateDisplay") {
    timeLeft = message.timeLeft;
    isRunning = message.timerRunning;
    updateTimerUI();
  }

  if (message.action === "siteAdded") {
    addSiteToList(message.site);
  }

  if (message.action === "siteDeleted") {
    removeSiteFromList(message.site);
  }
});

chrome.storage.local.get(["blockedSites"], function (result) {
  renderSites(result.blockedSites || []);
});

chrome.runtime.sendMessage({ action: "getTimerStatus" });
updateTimerUI();
