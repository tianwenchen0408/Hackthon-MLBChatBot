// background.js - 管理后台逻辑和 API 请求

chrome.runtime.onInstalled.addListener(() => {
    console.log('MLB AI Chatbot 扩展已安装');
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'fetchData') {
      fetch('https://statsapi.mlb.com/api/v1.1/game/716463/feed/live')
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch MLB data');
          }
          return response.json();
        })
        .then(data => {
          sendResponse({ success: true, data });
        })
        .catch(error => {
          console.error('Fetch error:', error);
          sendResponse({ success: false, error: error.message });
        });
  
      // 返回 true，表示异步响应
      return true;
    }
  });
  