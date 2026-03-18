let startBtn = document.querySelector("#startBtn");
let restartBtn = document.querySelector("#restartBtn");
let siteInput = document.querySelector("#siteInput");
let addSiteBtn = document.querySelector("#addSiteBtn");
let blockedSitesList = document.querySelector("#blockedSitesList");

  let timerRunning = false;


startBtn.addEventListener("click", () => {
    timerRunning = !timerRunning; 
    
    if (timerRunning) {
        startBtn.textContent = "Stop Focus";
    } else {
        startBtn.textContent = "Start Focus";
    }
});

addSiteBtn.addEventListener("click", () => {
    let siteName = siteInput.value;  // Get what user typed
    
    if (siteName.trim() === "") {
        // alert("Please enter a site");
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
            e.target.parentElement.remove();  // Remove the <li>
        });
    });
}

addDeleteListener();
