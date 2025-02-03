import requests
import os

from config import GOOGLE_AI_API_KEY

from langchain_google_genai import ChatGoogleGenerativeAI #get_gemini_response(uesr_input,user_uuid)
from langchain_core.messages import HumanMessage, SystemMessage
from services.play_state_tracker import PlayStateTracker, get_current_play_info


import json


prompt = """
Your role is a baseball commentator. Your task is to analyze the time series of various variables from the baseball game and explain the strategies used.
Your audience consists of seasoned baseball enthusiasts, you can use advanced terminology and keep the output within one sentences.

Task Details:
1. The audience consists of viewers with 2-3 years of baseball-watching experience. You can use some technical terms to analyze the strategies and their reasons.
2. Focus on analyzing the play event that occurred after the last incident and provide a continuous commentary.
3. If no specific strategy was used (e.g., it was a simple base hit), you can briefly describe the event. If any strategies from the following sets were employed, identify and expand on them, providing a concise analysis of why they were used.
Offensive Strategies: [Bunt, Stealing Bases, Hit-and-Run, Sacrifice Fly, Plate Discipline]
Defensive Strategies: [Double Play, Shift Defense, Infield In, Cut-Off Play, Pick-Off]
Pitching Strategies: [Mixing Fastballs and Off-Speed Pitches, Using Inside and Outside Corners, Intentional Walk]
Other Strategies: [Time Management, Psychological Warfare, Coaching Signals]
Given the inputs:

"""



def get_gemini_response(user_input):
    """
    调用 Gemini 模型并获取响应
    """
    # try:
    # Define the model
    model = ChatGoogleGenerativeAI(
        model="gemini-1.5-pro",
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
        google_api_key = GOOGLE_AI_API_KEY,
        # tools='code_execution'
        # other params...
        )
    response = model.invoke(user_input)
    print(response.content)
    
    return response.content


def get_live_game_data(game_id):
    """
    调用 Gemini 模型
    没有记忆功能
    处理 MLB解说请求
    """
    try:
        
        timestamp_url = f"https://statsapi.mlb.com/api/v1.1/game/{game_id}/feed/live/timestamps"
        #获取15个时间戳 -->7个时间戳的时间跨度约等于2分钟，既一个allPlay事件的间隔
        timestamp_data = requests.get(timestamp_url).json()[-15:]
        
        state_tracker = PlayStateTracker()

        #初始化，并用时间戳获取数据-->拿到过去和当前的数据处理后写入play_info
        play_info = {}
        for timestamp in timestamp_data:
            play_info = get_current_play_info(game_id,timestamp,state_tracker)
        
       
        #构建输入   
        input = [SystemMessage(content=prompt),HumanMessage(content=str(play_info))]

        #调用Gemini模型
        response = get_gemini_response(input)

        return response

    except Exception as e:
        return {"error": str(e)}



