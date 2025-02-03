// startWindow.js
const batterupLogo = chrome.runtime.getURL("assets/batterup-logo.png");
const startButton = chrome.runtime.getURL("assets/start-button.png");
const cuteIcon1 = chrome.runtime.getURL("assets/cute-icon-1.png");
const cuteIcon2 = chrome.runtime.getURL("assets/cute-icon-2.png");
const closeIconStartWin = chrome.runtime.getURL("assets/close.png");

// 获取gameid
function extractGameIdFromUrl() {
  const url = window.location.href; 
  const match = url.match(/game=(\d+)/);
  if (match && match[1]) {
    console.log("Game ID found:", match[1]);
    return match[1];
  }
  console.error("No Game ID found in URL");
  return null;
}

function createStartWindow() {
  if (document.getElementById("start-popup")) return;
  //获取gameid
  const gameId = extractGameIdFromUrl(); 
  const message = gameId
  ? "Please press Start to start chatting."
  : "Please navigate to the live page.";

  const startWindow = document.createElement("div");
  startWindow.id = "start-popup";

  startWindow.innerHTML = `
  <div class="start-window">
    <img src="${closeIconStartWin}" alt="Close" id="close-start-window" class="start-window-close">
    <img src="${batterupLogo}" alt="Batterup Bot" class="batterup-logo">
    <p id="game-id-message" style="margin-top: 10px;">${message}</p>
    <button class="start-button" ${gameId ? "" : "disabled"}>
      <img src="${startButton}" alt="Start" class="start-button-img">
    </button>
  </div>
`;

  document.body.appendChild(startWindow);

  // 关闭按钮事件
  document.getElementById("close-start-window").addEventListener("click", () => {
    startWindow.remove();
    // Show the floating chat button when closing the window
    const floatingButton = document.getElementById("floating-chat-button");
    if (floatingButton) {
      floatingButton.style.display = "block";
    }
  });

  // 开始按钮事件
  startWindow.querySelector('.start-button').addEventListener('click', () => {
    startWindow.remove();
    const newUuid = crypto.randomUUID();
    createChatWindow(newUuid, gameId);
  });

  
  




}