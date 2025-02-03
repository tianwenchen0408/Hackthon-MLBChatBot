from langchain.memory import ConversationBufferMemory

# 创建记忆实例
memory = ConversationBufferMemory()

def add_to_memory(user_input, bot_response):
    memory.save_context({"input": user_input}, {"output": bot_response})

def get_conversation_history():
    return memory.load_memory_variables({})
