
import os
from dotenv import load_dotenv

# 加载 .env 文件中的环境变量
load_dotenv()

# 获取 Google Gemini API Key
GOOGLE_AI_API_KEY = os.getenv('GOOGLE_AI_API_KEY')

# 如果未找到 API Key，抛出异常
if not GOOGLE_AI_API_KEY:
    raise ValueError("GOOGLE_AI_API_KEY is not set in .env file.")
