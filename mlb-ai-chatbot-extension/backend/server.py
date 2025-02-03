import os
import sys
from flask import Flask

from flask_cors import CORS

app = Flask(__name__)
CORS(app)

from dotenv import load_dotenv

# 将当前路径添加到 Python 模块路径
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'routers')))
# 加载环境变量
load_dotenv()

# 导入路由
from routers.ai_routes import ai_blueprint
from routers.mlb_routes import mlb_blueprint


api_key = os.getenv('GOOGLE_AI_API_KEY')

# 初始化 Flask 应用
app = Flask(__name__)

# 注册路由
app.register_blueprint(mlb_blueprint, url_prefix='/api/mlb')
app.register_blueprint(ai_blueprint, url_prefix='/api/ai')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
# curl -X POST http://127.0.0.1:5001/api/ai/chat \
# -H "Content-Type: application/json" \
# -d '{"message": "What is the latest MLB news?"}'


# curl -X POST "https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent?key=3334ab64953e9d5badf14f63804aaf2615e276fa" \
# -H "Content-Type: application/json" \
# -d '{
#   "contents": [{
#     "parts": [{
#       "text": "What is the latest MLB news?"
#     }]
#   }]
# }'
