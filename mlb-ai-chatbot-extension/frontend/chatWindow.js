// chatWindow.js - 聊天窗口逻辑
const botAvatar = chrome.runtime.getURL("assets/bot-avatar-2.png");
const userAvatar = chrome.runtime.getURL("assets/user-avatar-2.png");
const closeIcon = chrome.runtime.getURL("assets/close.png");
const sendIcon = chrome.runtime.getURL("assets/send.png");
const questionIcon = chrome.runtime.getURL("assets/predefined-questions.png");
const botBubble = chrome.runtime.getURL("assets/bot-bubble.svg");
const userBubble = chrome.runtime.getURL("assets/user-bubble.svg");
const backgroundPath = chrome.runtime.getURL("assets/bot-background.png");

function loadGoogleFont() {
  // 添加 preconnect 标签
  const preconnect1 = document.createElement('link');
  preconnect1.rel = 'preconnect';
  preconnect1.href = 'https://fonts.googleapis.com';
  document.head.appendChild(preconnect1);

  const preconnect2 = document.createElement('link');
  preconnect2.rel = 'preconnect';
  preconnect2.href = 'https://fonts.gstatic.com';
  preconnect2.crossOrigin = 'anonymous';
  document.head.appendChild(preconnect2);

  // 添加字体的主 link 标签
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Rationale&display=swap';
  document.head.appendChild(fontLink);
}

// 调用函数加载字体
loadGoogleFont();

// 格式化时间函数
function formatTimestamp(date) {
  const options = {
    month: "short", // 简写月份（如 "Jan"）
    day: "numeric", // 日期数字
    year: "numeric", // 年份
    hour: "numeric", // 小时
    minute: "2-digit", // 分钟，两位数
    hour12: true // 使用 12 小时制
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

// 在聊天窗口中调用
const timestamp = formatTimestamp(new Date()); // 生成格式化的时间


async function createChatWindow(newUuid, game_pk) {
  // 检查是否已存在窗口，避免重复创建
  if (document.getElementById("chat-popup")) return;
  const { awayTeam, homeTeam } = await fetchTeamData(game_pk);
  const welcomeMessage = `Welcome to MLB AI Chatbot! You are watching ${awayTeam} VS ${homeTeam} game. How can I help you today?`;
  const chatWindow = document.createElement("div");
  chatWindow.id = "chat-popup";
  chatWindow.innerHTML = `
      <div class="chat-popup-header">
        <div class="header-controls">
          <button class="minimize-button">➖</button>
          <span class="header-title">Chat With Bot</span>
        </div>
        <img src="${closeIcon}" alt="Close" id="close-chat" class="chat-popup-close">
      </div>
              <div class="pattern-container">
            <div class="commentary-box" id="commentary-box">
         <!-- 动态解说内容将插入到这里 -->
    </div>
        </div> <!-- 新的背景区域 -->
      <div class="chat-popup-body">


        <!-- 时间戳 -->
        <div class="chat-timestamp">${timestamp}</div>
        <!-- 初始消息 -->
        <div class="chat-message bot">
          <img src=${botAvatar} alt="Bot Avatar" class="chat-avatar">
          <div class="chat-text">${welcomeMessage}</div>
        </div>
      </div>
      <!-- Suggestion container -->
      <div class="chat-suggestions" id="chat-suggestions"></div>

      <div class="chat-popup-footer">
        <button id="question-chat" class="question-button">
          <img src="${questionIcon}" alt="Question" class="question-icon">
        </button>
        <input type="text" id="chat-input" placeholder="Type a message...">
        <button id="send-chat" class="send-button">
          <img src="${sendIcon}" alt="Send" class="send-icon">
        </button>
      </div>
    `;
  document.body.appendChild(chatWindow);

  // Add this after creating the chat window
  document.querySelector('.chat-popup-body').style.backgroundImage = `url('${backgroundPath}')`;
  document.documentElement.style.setProperty('--bot-bubble-url', `url("${botBubble}")`);
  document.documentElement.style.setProperty('--user-bubble-url', `url("${userBubble}")`);


  await fetchTeamData2(game_pk);

  // 关闭按钮事件
  document.getElementById("close-chat").addEventListener("click", () => {
    chatWindow.remove();
    // Show the floating chat button when closing the window
    const floatingButton = document.getElementById("floating-chat-button");
    if (floatingButton) {
      floatingButton.style.display = "block";
    }
  });

  // 最小化按钮事件
  document.querySelector(".minimize-button").addEventListener("click", () => {
    chatWindow.classList.add("minimized");
    // Show the floating chat button
    const floatingButton = document.getElementById("floating-chat-button");
    if (floatingButton) {
      floatingButton.style.display = "block";
    }
  });


  // 发送消息事件
  document.getElementById("send-chat").addEventListener("click", async () => {
    const input = document.getElementById("chat-input");
    const message = input.value.trim();

    if (message) {
      addChatMessage("user", userAvatar, message);
      input.value = "";

      try {
        // 发送消息到后端 API

        const response = await fetch("http://127.0.0.1:5001/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            game_pk: game_pk,
            id: newUuid,
          }),
        });

        if (!response.ok) {
          throw new Error(`Server Error: ${response.status}`);
        }

        const data = await response.json();
        addChatMessage("bot", botAvatar, data.reply || "No response from AI");
      } catch (error) {
        console.error("Error fetching AI response:", error);
        addChatMessage(
          "bot",
          botAvatar,
          "Error: Unable to fetch response from AI"
        );
      }
    }
  });

  // Function to fetch team data
  async function fetchTeamData(gameId) {
    try {
      const response = await fetch(
        `https://statsapi.mlb.com/api/v1.1/game/${gameId}/feed/live`
      );
      if (!response.ok) throw new Error(`Failed to fetch game data: ${response.status}`);
      const data = await response.json();

      const awayTeam = data.gameData.teams.away.name;
      const homeTeam = data.gameData.teams.home.name;
      return { awayTeam, homeTeam };
    } catch (error) {
      console.error("Error fetching game data:", error);
      return { awayTeam: "Unknown", homeTeam: "Unknown" }; // Fallback data
    }
  }

  async function fetchTeamData2(gameId) {
    //开场-获取球队介绍
    try {
      const res = await fetch("http://127.0.0.1:5001/api/ai/warmup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game_pk: game_pk,
        }),
      });
      if (!res.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }
      const data = await res.json();
      addChatMessage("bot", botAvatar, data.reply || "No response from AI");
    } catch (error) {
      addChatMessage("bot", botAvatar, "Error: Unable to fetch response from AI");
    }
  }

  // 添加消息到聊天框
  function addChatMessage(sender, avatar, text) {
    const chatBody = document.querySelector(".chat-popup-body");
    const messageDiv = document.createElement("div");
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.innerHTML = `
          <img src="${avatar}" alt="${sender} Avatar" class="chat-avatar">
          <div class="chat-text">${text}</div>
      `;
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight; // 滚动到底部
  }

  function addCommentaryMessage(text) {
    const commentaryBox = document.getElementById("commentary-box");
    if (!commentaryBox) return; // 确保目标区域存在

    const commentaryDiv = document.createElement("div");
    commentaryDiv.className = "commentary-message";
    commentaryDiv.textContent = text;

    commentaryBox.appendChild(commentaryDiv);
    commentaryBox.scrollTop = commentaryBox.scrollHeight; // 滚动到底部
  }

  checkIfGameEnded(game_pk);

  let target = 0;
  // 周期性（10s）检查是否有新的消息

  async function periodicApiCall() {
    if (!game_pk) return;

    try {
      const response = await fetch(
        `https://statsapi.mlb.com/api/v1.1/game/${game_pk}/feed/live`
      );
      if (!response.ok) {
        throw new Error(`Periodic API Error: ${response.status}`);
      }
      const data = await response.json();
      if (data.liveData.plays.allPlays.length == target) {
        return;
      } else {
        target = data.liveData.plays.allPlays.length;
      }
    } catch (error) {
      console.error("Error in periodic API call:", error);
    }

    try {
      const response = await fetch("http://127.0.0.1:5001/api/mlb/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game_id: game_pk,
        }),
      });
      if (!response.ok) {
        throw new Error(`Periodic API Error: ${response.status}`);
      }
      const data = await response.json();

      if (data.reply) {
        addCommentaryMessage(data.reply);
      }
    } catch (error) {
      console.error("Error in periodic API call:", error);
    }
  }

 
  target_time = {}
  // 选择视频回放模式或者实时比赛模式
  async function checkIfGameEnded(game_pk) {
    try {
      const response = await fetch(
        `https://statsapi.mlb.com/api/v1.1/game/${game_pk}/feed/live`
      );
      if (!response.ok) {
        throw new Error(`Error checking game status: ${response.status}`);
      }
      const data = await response.json();
      const statusCode = data.gameData.status.statusCode;
      console.log("statusCode: ",statusCode);
      // 1. 如果比赛结束，进行视频进程监听
      if (statusCode === "F") {
        // 从url获得开始时间start_time
        // e.g. "#game=775296,tfs=20241031_000800,game_state=live"
        const hash = window.location.hash;
        if (!hash) return;

        //精确到分钟
        const start_time = hash.match(/tfs=([^,]+)/)[1].slice(0, -2);

        // 拆分
        const datePart = start_time.split("_")[0];  // "20241031"
        const timePart = start_time.split("_")[1];  // "0008"

        // 解析
        const year = datePart.slice(0, 4);  // "2024"
        const month = datePart.slice(4, 6);  // "10"  (注意JS中月份是0-11，需要减1)
        const day = datePart.slice(6, 8);  // "31"

        const hour = timePart.slice(0, 2); // "00"
        const minute = timePart.slice(2, 4); // "08"

        // 创建 JS Date 对象  (月份要减1) -UTC时间
        let baseDateUTC = Date.UTC(year, Number(month) - 1, day, hour, minute);
        baseDateUTC =baseDateUTC-7.5* 60 * 1000;

        //从mlb api拿所有时间的发生时间
         try {
          const url = `https://statsapi.mlb.com/api/v1.1/game/${game_pk}/feed/live/`;
          const response = await fetch(url);
          const jsonData = await response.json();
      
          // 取出 allPlays 数组
          const allData = jsonData.liveData.plays.allPlays;
      
          // 遍历 allData
          for (const [index, play] of allData.entries()) {
            // 获得每个事件的时间节点
            endTime = play.about.endTime;

              // 解析为 JS Date
            const dt = new Date(endTime);

            // 若要使用 UTC 时间，可用 getUTC* 系列方法（与 Python strptime("%Y-%m-%dT%H:%M:%S.%fZ") 更接近）
            const year    = dt.getUTCFullYear().toString().padStart(4, "0");
            const month   = String(dt.getUTCMonth() + 1).padStart(2, "0"); // 0-11，所以要 +1
            const day     = String(dt.getUTCDate()).padStart(2, "0");
            const hour    = String(dt.getUTCHours()).padStart(2, "0");
            const minute  = String(dt.getUTCMinutes()).padStart(2, "0");

            // 拼成 "YYYYMMDD_HHMM" 的格式
            const formattedTime = `${year}${month}${day}_${hour}${minute}`;
            console.log("formattedTime: ", formattedTime)
            target_time[formattedTime] = index;
          }
        } catch (error) {
          console.error("Error in periodic API call:", error);
        }

        console.log("正在给 video 添加 timeupdate 监听器");
        setTimeout(async () => {
          const video = document.querySelector("#player-app video");
          console.log("Found:", video);
          if (video) {
            let lastCallTime = 0;
            video.addEventListener("timeupdate", async() => {

              let currentTime = Math.floor(video.currentTime);
              // 如果与上一次执行相差 >= 30 秒，则执行
              if (currentTime - lastCallTime >= 30) {
                console.log("执行30秒一次的逻辑，当前时间:", currentTime);
                // 更新上一次执行的时间
                lastCallTime = currentTime;
                
                let totalSeconds = Math.floor(video.currentTime);
                let currentTimeInMinutes = Math.floor(totalSeconds / 60);

                // 克隆一份 baseDate，然后加上 currentTimeInMinutes
                let tempDate = new Date(baseDateUTC);  // make a fresh copy
                // use setUTCMinutes (not setMinutes) so you stay in UTC
                tempDate.setUTCMinutes(tempDate.getUTCMinutes() + currentTimeInMinutes);

                // 格式化回 yyyymmdd_HHMM
                let yearStr   = tempDate.getUTCFullYear().toString().padStart(4, "0");
                let monthStr  = (tempDate.getUTCMonth() + 1).toString().padStart(2, "0");
                let dayStr    = tempDate.getUTCDate().toString().padStart(2, "0");
                let hourStr   = tempDate.getUTCHours().toString().padStart(2, "0");
                let minuteStr = tempDate.getUTCMinutes().toString().padStart(2, "0");
                let finalTime = `${yearStr}${monthStr}${dayStr}_${hourStr}${minuteStr}`;
                
                console.log("finalTime: ", finalTime);
                //事件时间命中
                if(finalTime in target_time){
                  console.log(target_time[finalTime])
                  try {
                    const response = await fetch("http://127.0.0.1:5001/api/mlb/video", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        game_id: game_pk,
                        index: target_time[finalTime],
                      }),
                    });
                    if (!response.ok) {
                      throw new Error(`Video Analyze API Error: ${response.status}`);
                    }
                    const data = await response.json();
              
                    if (data.reply) {
                      addCommentaryMessage(data.reply);
                    }
                  } catch (error) {
                    console.error("Error in video analyze API call:", error);
                  }
                }

              }
            });
          }
        }, 3000);
      } else {
        // 2. 如果比赛未结束，周期性 API 调用
        setInterval(periodicApiCall, 10 * 1000);
      }
    } catch (err) {
      console.error("Error in checkIfGameEnded:", err);
    }
  }

}

// minimize
function handleFloatingButtonClick() {
  const existingChat = document.getElementById("chat-popup");
  if (existingChat) {
    if (existingChat.classList.contains("minimized")) {
      existingChat.classList.remove("minimized");
      document.getElementById("floating-chat-button").style.display = "none";
    }
  } else {
    createChatWindow(generateUUID());
  }
}


