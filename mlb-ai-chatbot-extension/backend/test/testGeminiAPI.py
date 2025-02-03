import google.generativeai as genai

genai.configure(api_key='AIzaSyCTqQiIJ6tfTo6zOpEGNdE9U0XHOI15Dds')

try:
    model = genai.GenerativeModel('gemini-1.0-pro')
    response = model.generate_content("What is the latest MLB news?")
    print("✅ Success:", response.text)
except Exception as e:
    print("❌ Error:", e)
