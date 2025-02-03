### 📚 **MLB AI Chatbot Extension**

**项目名称**: **MLB AI Chatbot Extension**  
**描述**: 利用 Google Gemini 模型和 MLB 数据，提供实时 MLB 比赛分析与 AI 聊天助手。通过浏览器插件与用户互动，实现直观的数据查询和聊天体验。

---

## 🚀 **项目简介**

**MLB AI Chatbot Extension** 是一个基于 Google Gemini 和 MLB 数据 API 的 Chrome 扩展，旨在为用户提供：

- ⚾ **实时 MLB 比赛数据**：直接从 MLB API 拉取实时比赛信息。  
- 🤖 **AI 聊天助手**：基于 Google Gemini 模型，回答关于比赛、球队、球员等相关问题。  
- 🖥️ **用户友好的界面**：使用简单的悬浮按钮和聊天弹窗，轻松与 AI 互动。

---

## 📂 **项目结构**

```
mlb-ai-chatbot-extension/
├── backend/
│   ├── server.py           # Flask 主服务器入口
│   ├── config.py           # API Key 配置
│   ├── requirements.txt    # Python 依赖库
│   ├── routes/
│   │   ├── mlb_routes.py   # MLB API 数据路由
│   │   ├── ai_routes.py    # AI 模型路由
│   ├── services/
│   │   ├── mlb_service.py  # MLB 数据处理服务
│   │   ├── ai_service.py   # AI 模型调用服务
├── frontend/
│   ├── manifest.json       # Chrome 扩展配置文件
│   ├── content.js          # 页面脚本，处理悬浮按钮
│   ├── chatWindow.js       # 聊天窗口逻辑
│   ├── styles.css          # 样式文件
│   ├── popup.html          # 扩展弹出页面
│   ├── assets/
│   │   ├── bot-avatar.png  # 机器人头像
│   │   ├── user-avatar.png # 用户头像
└── .env                   # 环境变量配置
```

---

## 🛠️ **技术栈**

### **后端：**
- **Flask**：轻量级 Web 框架  
- **Flask-CORS**：跨域资源共享  
- **Google Generative AI SDK**：访问 Google Gemini 模型  
- **LangChain**：AI 工作流构建  

### **前端：**
- **JavaScript**：核心业务逻辑  
- **HTML/CSS**：界面设计与样式  
- **Chrome Extensions API**：浏览器插件功能  

---

## ⚙️ **环境配置**

### **1. 后端配置**

#### **1.1 安装依赖**
```bash
cd mlb-ai-chatbot-extension
cd backend
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

#### **1.2 配置环境变量**
在 `.env` 文件中设置以下内容：

```env
GOOGLE_AI_API_KEY=your-google-api-key
```

#### **1.3 运行后端服务**
```bash
python server.py
```
后端将运行在：`http://127.0.0.1:5001`

---

### **2. 前端配置**

#### **2.1 加载 Chrome 扩展**
1. 打开 `chrome://extensions/`  
2. 启用 **开发者模式**  
3. 点击 **“加载已解压的扩展程序”**  
4. 选择 `frontend` 文件夹  

#### **2.2 测试扩展**
- 点击浏览器右上角的扩展图标。  
- 点击 **💬 悬浮按钮**，与 AI 聊天。

---

## 📊 **API 路径**

### **后端 API**

1. **获取 AI 聊天响应**  
   ```
   POST http://127.0.0.1:5001/api/ai/chat
   Body: { "message": "What is the latest MLB news?" }
   ```

2. **获取 MLB 实时数据**  
   ```
   GET http://127.0.0.1:5001/api/mlb/live/<gameId>
   ```

---

## 🎯 **功能展示**

1. 💬 **用户点击悬浮按钮**，打开聊天窗口。  
2. ⚡ **输入问题**，例如：“What is the latest MLB news?”  
3. 🤖 **AI 返回答案**，显示在聊天框内。  
4. 📊 **实时数据展示**，可查询特定比赛数据。  

---

## 🐞 **常见问题**

### **1. CORS 错误**
确保在后端启用了 CORS：
```python
from flask_cors import CORS
CORS(app)
```

### **2. API Key 错误**
- 检查 `.env` 中 `GOOGLE_AI_API_KEY` 是否正确。  
- 确保已启用 Google Gemini API。

### **3. 前端请求失败**
- 检查 `manifest.json` 中 `host_permissions` 是否正确配置：
```json
"host_permissions": [
    "http://127.0.0.1:5001/*",
    "https://statsapi.mlb.com/*"
]
```

---

## 🤝 **贡献**

欢迎提出问题、报告 bug 或提交 pull request：

1. Fork 项目  
2. 创建一个分支：`git checkout -b feature-new-feature`  
3. 提交更改：`git commit -m "Add some feature"`  
4. 推送到分支：`git push origin feature-new-feature`  
5. 提交 Pull Request

---

## 📄 **许可证**

MIT License © 2025 MLB AI Chatbot

---

 

