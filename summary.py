import openai
import json
### 記錄對話內容的的AI，並且要適當的做成summery
def GPT_processor(message, function_description):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        max_tokens=1000,
        temperature=0.5,
        messages=[{"role": "user", "content": message}],
        functions=function_description,
        function_call = {"name":function_description[0]['name']}
    )
    return response

def summary_processor():
    f = open('./conversation_file/conversation.txt',encoding="utf-8")
    conversation_history = f.read()
    f.close
    if len(conversation_history) >= 3000:
        summary_prompt = "請把以下內容summary成小於2000字:"
        summary_prompt = summary_prompt + conversation_history
        with open('./conversation_file/conversation_summary_description.json',encoding="utf-8") as file:
            conversation_summary_description = [json.load(file)]
        conversation_response = GPT_processor(summary_prompt,conversation_summary_description)
        conversation_object  = json.dumps(conversation_response.choices[0].message.function_call.arguments)
        f = open("./conversation_file/conversation.txt", "w",encoding="utf-8")
        f.write(conversation_object)
        f.close()
        
