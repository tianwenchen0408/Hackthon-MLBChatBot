## 📚 **MLB AI Chatbot Chrome Extension**

**项目名称**: **MLB AI Chatbot Chrome Extension**  
**描述**: 一个基于 Google Gemini 模型和 MLB 数据 API 的 Chrome 浏览器扩展，提供实时 MLB 数据查询和 AI 聊天助手功能。

---

## 🚀 **项目简介**

**MLB AI Chatbot Chrome Extension** 让用户可以：
- ⚾ **实时查询 MLB 比赛数据**：获取最新的比赛统计和球队表现。  
- 🤖 **AI 聊天助手**：基于 Google Gemini 模型回答用户问题。  
- 🖱️ **轻松交互**：通过可拖动的悬浮按钮快速打开聊天窗口，随时与 AI 互动。  

---

## 📂 **项目结构**

```
frontend/
├── manifest.json        # Chrome 扩展配置文件
├── content.js           # 页面脚本，管理悬浮按钮和聊天窗口逻辑
├── chatWindow.js        # 聊天窗口逻辑，处理用户与 AI 的交互
├── styles.css           # 聊天窗口样式
├── popup.html           # 弹出式 UI 界面
├── popup.js             # 处理 popup 界面逻辑
├── assets/
│   ├── bot-avatar.png   # 机器人头像
│   ├── user-avatar.png  # 用户头像
│   ├── icon16.png       # 扩展图标 (16x16)
│   ├── icon48.png       # 扩展图标 (48x48)
│   ├── icon128.png      # 扩展图标 (128x128)
```

---

## 🛠️ **技术栈**

- **HTML/CSS**：用户界面和样式  
- **JavaScript**：核心业务逻辑  
- **Chrome Extensions API**：与浏览器进行交互  
- **Fetch API**：与后端 API 进行通信  

---

## ⚙️ **配置与安装**

### **1. 加载 Chrome 扩展**

1. 打开 Chrome 浏览器，进入 `chrome://extensions/` 页面。  
2. 启用 **“开发者模式”**。  
3. 点击 **“加载已解压的扩展程序”**。  
4. 选择 **`frontend`** 文件夹。  
5. 扩展加载后，将在浏览器右上角显示扩展图标。  

---

### **2. 修改配置（如有必要）**

#### **manifest.json**
确保 `host_permissions` 正确指向你的后端服务器和 MLB 数据 API：

```json
{
  "manifest_version": 3,
  "name": "MLB AI Chatbot",
  "version": "1.0",
  "description": "实时 MLB 比赛 AI 策略分析助手",
  "permissions": ["storage", "activeTab", "scripting"],
  "host_permissions": [
    "http://127.0.0.1:5001/*",
    "https://statsapi.mlb.com/*"
  ],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "assets/icon16.png",
      "48": "assets/icon48.png",
      "128": "assets/icon128.png"
    }
  },
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["*://*.mlb.com/*"],
      "js": ["content.js"]
    }
  ]
}
```

---

## 💬 **功能说明**

### **1. 悬浮按钮**
- 显示在网页右下角。  
- **单击**：打开/关闭聊天窗口。  
- **拖动**：可以自由移动按钮位置。  
- **位置记忆**：按钮的位置会被保存，刷新页面后依然有效。  

### **2. 聊天窗口**
- **用户消息**：在输入框中输入问题并发送。  
- **AI 回复**：后端通过 Google Gemini API 返回答案。  
- **实时互动**：支持连续对话。  

### **3. 实时 MLB 数据**
- 集成 MLB StatsAPI 获取比赛数据。  
- 支持通过后端 API 查询特定比赛、球队或球员信息。

---

## 📊 **API 调用**

### **AI 聊天接口**
- **Endpoint**: `http://127.0.0.1:5001/api/ai/chat`  
- **Method**: `POST`  
- **Request Body**:  
  ```json
  {
    "message": "What is the latest MLB news?"
  }
  ```
- **Response**:  
  ```json
  {
    "reply": "The latest MLB news is..."
  }
  ```

### **MLB 实时数据接口**
- **Endpoint**: `http://127.0.0.1:5001/api/mlb/live/{gameId}`  
- **Method**: `GET`  
- **Response**:  
  ```json
  {
    "gameId": "12345",
    "status": "In Progress",
    "score": "5-3"
  }
  ```

---

## 🎯 **使用方法**

1. **打开 Chrome 扩展**  
   - 点击右下角悬浮按钮（💬）。  
2. **发送消息**  
   - 输入你的问题并点击 `Send` 按钮。  
3. **接收回复**  
   - AI 将返回相关答案。  
4. **查询 MLB 数据**  
   - 在对话框中询问相关的 MLB 比赛、球队或球员信息。  

---

## 🐞 **常见问题**

### **1. AI 无法回复**
- 检查后端是否已成功运行：`http://127.0.0.1:5001`  
- 确保 Google Gemini API Key 有效。  

### **2. CORS 错误**
- 确保 Flask 后端启用了 `CORS` 支持：  
  ```python
  from flask_cors import CORS
  CORS(app)
  ```

### **3. 扩展未加载**
- 在 `chrome://extensions/` 中重新加载扩展。  
- 检查 `manifest.json` 是否配置正确。  

---

## 🤝 **贡献**

欢迎提出问题、报告 bug 或提交 pull request：

1. **Fork** 项目  
2. 创建一个分支：`git checkout -b feature-new-feature`  
3. 提交更改：`git commit -m "Add some feature"`  
4. 推送到分支：`git push origin feature-new-feature`  
5. 提交 **Pull Request**

---

## 📄 **许可证**

MIT License © 2025 MLB AI Chatbot Extension

---

