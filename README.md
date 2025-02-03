### 📚 **MLB AI Chatbot Extension**

**Project Name**: **MLB AI Chatbot Extension**  
**Description**: Utilizing the Google Gemini model and MLB data to provide real-time MLB game analysis and AI chat assistant. Interact with users through a browser extension for intuitive data queries and chat experience.

---

## 🚀 **Project Overview**

**MLB AI Chatbot Extension** is a Chrome extension based on Google Gemini and MLB Data API, designed to provide users with:

- ⚾ **Real-time MLB Game Data**: Fetch real-time game information directly from the MLB API.  
- 🤖 **AI Chat Assistant**: Based on the Google Gemini model, answer questions about games, teams, players, etc.  
- 🖥️ **User-friendly Interface**: Easy interaction with AI using simple floating buttons and chat pop-ups.

---

## 📂 **Project Structure**

```
mlb-ai-chatbot-extension/
├── backend/
│   ├── server.py           # Main server entry point using Flask
│   ├── config.py           # API Key configuration
│   ├── requirements.txt    # Python dependencies
│   ├── routes/
│   │   ├── mlb_routes.py   # MLB API data routes
│   │   ├── ai_routes.py    # AI model routes
│   ├── services/
│   │   ├── mlb_service.py  # MLB data processing service
│   │   ├── ai_service.py   # AI model invocation service
├── frontend/
│   ├── manifest.json       # Chrome extension configuration file
│   ├── content.js          # Page script handling floating button
│   ├── chatWindow.js       # Chat window logic
│   ├── styles.css          # Stylesheet
│   ├── popup.html          # Extension popup page
│   ├── assets/
│   │   ├── bot-avatar.png  # Bot avatar
│   │   ├── user-avatar.png # User avatar
└── .env                   # Environment variable configuration
```

---

## 🛠️ **Tech Stack**

### **Backend:**
- **Flask**: Lightweight web framework  
- **Flask-CORS**: Cross-Origin Resource Sharing  
- **Google Generative AI SDK**: Access Google Gemini model  
- **LangChain**: AI workflow construction  

### **Frontend:**
- **JavaScript**: Core business logic  
- **HTML/CSS**: Interface design and styling  
- **Chrome Extensions API**: Browser extension functionality  

---

## ⚙️ **Environment Setup**

### **1. Backend Setup**

#### **1.1 Install Dependencies**
```bash
cd mlb-ai-chatbot-extension
cd backend
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

#### **1.2 Configure Environment Variables**
Set the following in the `.env` file:

```env
GOOGLE_AI_API_KEY=your-google-api-key
```

#### **1.3 Run Backend Service**
```bash
python server.py
```
The backend will run at: `http://127.0.0.1:5001`

---

### **2. Frontend Setup**

#### **2.1 Load Chrome Extension**
1. Open `chrome://extensions/`  
2. Enable **Developer mode**  
3. Click **“Load unpacked”**  
4. Select the `frontend` folder  

#### **2.2 Test Extension**
- Click the extension icon at the top right of the browser.  
- Click the **💬 floating button** to chat with the AI.

---

## 📊 **API Endpoints**

### **Backend API**

1. **Get AI Chat Response**  
    ```
    POST http://127.0.0.1:5001/api/ai/chat
    Body: { "message": "What is the latest MLB news?" }
    ```

2. **Get Real-time MLB Data**  
    ```
    GET http://127.0.0.1:5001/api/mlb/live/<gameId>
    ```

---

## 🎯 **Feature Showcase**

1. 💬 **User clicks the floating button** to open the chat window.  
2. ⚡ **Enter a question**, for example: "What is the latest MLB news?"  
3. 🤖 **AI returns an answer**, displayed in the chat box.  
4. 📊 **Real-time data display**, specific game data can be queried.  

---

## 🐞 **Common Issues**

### **1. CORS Error**
Ensure CORS is enabled on the backend:
```python
from flask_cors import CORS
CORS(app)
```

### **2. API Key Error**
- Check if `GOOGLE_AI_API_KEY` in `.env` is correct.  
- Ensure Google Gemini API is enabled.

### **3. Frontend Request Failure**
- Check if `host_permissions` in `manifest.json` is correctly configured:
```json
"host_permissions": [
     "http://127.0.0.1:5001/*",
     "https://statsapi.mlb.com/*"
]
```

---

## 🤝 **Contributing**

Feel free to raise issues, report bugs, or submit pull requests:

1. Fork the project  
2. Create a branch: `git checkout -b feature-new-feature`  
3. Commit your changes: `git commit -m "Add some feature"`  
4. Push to the branch: `git push origin feature-new-feature`  
5. Submit a Pull Request

---

## 📄 **License**

MIT License © 2025 MLB AI Chatbot
````
