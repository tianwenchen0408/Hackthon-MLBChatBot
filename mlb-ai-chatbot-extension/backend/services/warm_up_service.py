from config import GOOGLE_AI_API_KEY
import requests
import json
import os

from langgraph.prebuilt import create_react_agent
from langchain_core.tools import tool
from langchain_google_community import GoogleSearchAPIWrapper
from langchain_google_genai import ChatGoogleGenerativeAI 


os.getenv('GOOGLE_CSE_ID')
os.getenv('GOOGLE_AI_API_KEY')

@tool
def search(query: str):
    """
    google search tool
    """
    search = GoogleSearchAPIWrapper()
    return search.run(query)


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
tools = [search]


agent = create_react_agent(model, tools)


def get_warm_up_response(game_pk):
    """
    调用 Gemini 模型并获取响应
    不记录用户输入
    """
    try:
        url = f"https://statsapi.mlb.com/api/v1.1/game/{game_pk}/feed/live"
        game_data = requests.get(url).json()["gameData"]
        away_team = json.dumps(game_data["teams"]["away"]["name"])
        home_team = json.dumps(game_data["teams"]["home"]["name"])

        query = f"use search tool to fech {away_team}'s and {home_team}'s history win rate (%) and total salary of the players in the team. Give a very short answer."
        input = {"messages": [("human", query)]}

        output=agent.invoke(input)
    
        return output["messages"][-1].content

    except Exception as e:
        return f"Error: {str(e)}"