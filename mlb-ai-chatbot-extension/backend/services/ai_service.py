#https://python.langchain.com/docs/tutorials/chatbot/
#https://python.langchain.com/docs/integrations/chat/google_generative_ai/

# from langchain.llms import OpenAI
# from langchain.prompts import PromptTemplate
# from langchain.chains import LLMChain
# import os

# # 初始化 LLM
# llm = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# def chat_with_bot(user_input):
#     try:
#         template = PromptTemplate(
#             input_variables=['question'],
#             template="Answer this question about MLB: {question}"
#         )
#         chain = LLMChain(llm=llm, prompt=template)
#         response = chain.run(question=user_input)
#         return response
#     except Exception as e:
#         return str(e)

from config import GOOGLE_AI_API_KEY

import google.generativeai as genai # get_gemini_response(user_input )

from langchain_google_genai import ChatGoogleGenerativeAI #get_gemini_response(uesr_input,user_uuid)
from langchain_core.messages import HumanMessage
from langchain_core.messages import AIMessage
from langgraph.checkpoint.memory import MemorySaver       # message history persistence
from langgraph.graph import START, MessagesState, StateGraph  # message history persistence
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder # prompt

from typing import Sequence
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages
from typing_extensions import Annotated, TypedDict

from services.prompts import get_Du,get_Peter #prompt we can use
import requests
import json

# 初始化 Gemini 模型
genai.configure(api_key=GOOGLE_AI_API_KEY)

def get_gemini_response(user_input):
    """
    调用 Gemini 模型并获取响应
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-pro')  # 确保你的模型名称正确
        response = model.generate_content(user_input)
        return response.text  # 返回文本响应
    except Exception as e:
        return f"Error: {str(e)}"



#  -------------------------------Langchain part start-------------------------------------------

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

#prompt
prompt_template = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            get_Du(),
        ),
        MessagesPlaceholder(variable_name="messages"),
    ]
)

class State(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    base_data: str

# Define a new graph
workflow = StateGraph(state_schema=State)

# Define the function that calls the model
def call_model(state: State):
    prompt = prompt_template.invoke(state)
    response = model.invoke(prompt)
    return {"messages": response}

# Define the (single) node in the graph
workflow.add_edge(START, "model")
workflow.add_node("model", call_model)

# Add memory
memory = MemorySaver()
app = workflow.compile(checkpointer=memory)

def get_gemini_response(user_input,game_pk,user_uuid):
    """
    调用 Gemini 模型并获取响应
    每个用户聊天历史用uuid区分并记录在graph中
    """
    try:
        url = f"https://statsapi.mlb.com/api/v1.1/game/{game_pk}/feed/live"
        base_data = requests.get(url).json()["liveData"]["plays"]   #未来用Du和Peter的代码替换这里，进行更精细的数据处理
        base_str = json.dumps(base_data)

        #base_str = f"import requests\nurl = \"https://statsapi.mlb.com/api/v1.1/game/{game_pk}/feed/live\"\ndata = requests.get(url).json()[\"liveData\"][\"plays\"][\"currentPlay\"]\n" 

        config = {"configurable": {"thread_id": user_uuid}}
        input_messages = [HumanMessage(user_input)]
        output = app.invoke({"messages": input_messages,"base_data":base_str}, config)

        return output["messages"][-1].content

    except Exception as e:
        return f"Error: {str(e)}"

