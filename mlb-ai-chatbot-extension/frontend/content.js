// content.js - 保证悬浮按钮正常显示
console.log("MLB AI Chatbot content script 已注入");

// 确保 DOM 已加载
(function () {
  function createFloatingButton() {
    // 检查是否已存在按钮，避免重复创建
    if (document.getElementById("floating-chat-button")) return;

    // 创建悬浮按钮
    const chatButton = document.createElement("div");
    chatButton.id = "floating-chat-button";
    chatButton.innerHTML = "💬";
    document.body.appendChild(chatButton);

    // 添加基础样式
    Object.assign(chatButton.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      width: "60px",
      height: "60px",
      backgroundColor: " #FC8B40",
      color: "white",
      fontSize: "24px",
      textAlign: "center",
      lineHeight: "60px",
      borderRadius: "50%",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      cursor: "pointer",
      zIndex: "10000",
      userSelect: "none",
    });

    // 拖拽逻辑
    let isDragging = false;
    let wasDragged = false;
    let offsetX, offsetY;

    chatButton.addEventListener("mousedown", (e) => {
      isDragging = true;
      wasDragged = false;
      offsetX = e.clientX - chatButton.getBoundingClientRect().left;
      offsetY = e.clientY - chatButton.getBoundingClientRect().top;
      chatButton.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        wasDragged = true;
        chatButton.style.left = `${e.clientX - offsetX}px`;
        chatButton.style.top = `${e.clientY - offsetY}px`;
        chatButton.style.right = "auto";
        chatButton.style.bottom = "auto";
      }
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        chatButton.style.cursor = "pointer";

        // 保存位置
        localStorage.setItem(
          "chatBtnPosition",
          JSON.stringify({
            left: chatButton.style.left,
            top: chatButton.style.top,
          })
        );
      }
    });

    // 恢复保存的位置
    const savedPosition = JSON.parse(localStorage.getItem("chatBtnPosition"));
    if (savedPosition) {
      chatButton.style.left = savedPosition.left;
      chatButton.style.top = savedPosition.top;
      chatButton.style.right = "auto";
      chatButton.style.bottom = "auto";
    }

    // 点击打开/关闭 Chatbot 弹出窗口
    chatButton.addEventListener("click", () => {
      const existingChatWindow = document.getElementById("chat-popup");
      if (!wasDragged) {
        //const existingStartWindow = document.getElementById("start-popup");
        if (existingChatWindow) {
          if (existingChatWindow.classList.contains("minimized")) {
            existingChatWindow.classList.remove("minimized");
            chatButton.style.display = "none";
          }
        } else {
          createStartWindow();
          chatButton.style.display = "none";
          console.log("Start window opened");
        }
      }
    });
  }

  // 等待 DOM 完全加载
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    createFloatingButton();
  } else {
    document.addEventListener("DOMContentLoaded", createFloatingButton);
  }
})();

// 获取实时比赛数据
async function fetchLiveData(gameId) {
  try {
    gameId = 716463;
    const response = await fetch(
      `http://127.0.0.1:5001/api/mlb/live/${gameId}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Live Game Data:", data);

    return data;
  } catch (error) {
    console.error("Error fetching live game data:", error);
    return null;
  }
}

// 获取 AI 回复
async function fetchAIResponse(message) {
  try {
    const response = await fetch("http://127.0.0.1:5001/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI Response:", data.reply);

    return data.reply;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "Error: Unable to fetch AI response";
  }
}



