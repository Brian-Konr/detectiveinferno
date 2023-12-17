import openai
import json
from RAG import rag
from summary import summary_processor
import os
import ast
#### global variable 
m_list = [[],[],[],[]] 

#### openai processor
def GPT_processor(length, message, function_description):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        max_tokens=length,
        temperature=0.5,
        messages=[{"role": "user", "content": message}],
        functions=function_description,
        function_call = {"name":function_description[0]['name']}
    )
    return response

###### game creator
def story_creater():
    # conversation_count = 0
    m_list = [[],[],[],[]] 
    #### load start prompt
    f = open('./story_background/start_prompt.txt',encoding="utf-8")
    start_prompt = f.read()
    with open('./story_background/story_background_description.json',encoding="utf-8") as file:
        story_background_description = [json.load(file)]

    print("start process AI api")
       
    story_response = GPT_processor(2000,start_prompt, story_background_description)
    # store the story dictionary result to story.json
    f2 = open("./story_background/story.txt", "w",encoding="utf-8")
    f2.write(story_response.choices[0].message.function_call.arguments)

    story_object  = json.dumps(story_response.choices[0].message.function_call.arguments)
    # print(story_object.encode('ascii').decode('unicode-escape'))
    with open("./story_background/story.json", "w") as outfile:
        outfile.write(story_object)
    return story_response.choices[0].message.function_call.arguments


###### suspect creater
def suspect_creater(id,target,action):
    #### load suspect prompt
    f = open('./suspect_file/suspect_prompt.txt',encoding="utf-8")
    suspect_prompt = f.read()
    #### load conversation history
    # f2 = open(f"./suspect_file/suspect_{id}/conversation.txt",encoding="utf-8")
    # conversation_history = f2.read()
    keyword = action + "," + target
    
    conversation_history=""
    conversation_file = f"./suspect_file/suspect_{id}/conversation.txt"
    if os.stat(conversation_file).st_size == 0:
        conversation_history=""
    else:
        conversation_history = rag( keyword, conversation_file )

    #### load story txt
    # f = open("./story_background/story.txt",encoding="utf-8")
    story_txt = "./story_background/story.txt"
    story_txt_summary = rag( keyword, story_txt )

    suspect_prompt = story_txt_summary + "\n" + conversation_history + "\n" + suspect_prompt + " 你現在是嫌疑人:" + target +"，請回答以下問題：" + action
    with open('./suspect_file/suspect_description.json',encoding="utf-8") as file:
        suspect_description = [json.load(file)]
    suspect_response = GPT_processor(200,suspect_prompt, suspect_description)
    # suspect_object  = json.dumps(suspect_response.choices[0].message.function_call.arguments)
    
    #### store to list
    conversation_information = {
        "m_id": len(m_list[id]),
        "sender": 1,
        "message":action
    }
    m_list[id].append(conversation_information)

    conversation_information = {
        "m_id": len(m_list[id]),
        "sender": 0,
        "message":json.loads(suspect_response.choices[0].message.function_call.arguments).get("回覆")
    }
    m_list[id].append(conversation_information)
    ### write to conversation file
    f = open(f"./suspect_file/suspect_{id}/conversation.txt", "a",encoding="utf-8")
    f.write(f"玩家:{action}\n")
    f.write( f"{target}:{ json.loads(suspect_response.choices[0].message.function_call.arguments).get('回覆') }\n" )
    f.close()
    # summary_processor()
    print(json.loads(suspect_response.choices[0].message.function_call.arguments).get("回覆"))
    # print(suspect_object.encode('ascii').decode('unicode-escape'))
    # return suspect_response.choices[0].message.content
    return json.loads(suspect_response.choices[0].message.function_call.arguments).get("回覆")
    # store the reply
    # with open("./story_background/suspect.json", "w") as outfile:
    #     outfile.write(story_object)
    
    
###### scene_creater
def scene_creater(action):
    #### load start prompt
    f = open('./scene_file/scene_prompt.txt',encoding="utf-8")
    scene_prompt = f.read()
    
    #### load scene_conversation 
    # f2 = open("./conversation_file/conversation.txt",encoding="utf-8")
    # conversation_history = f2.read()
    keyword = action + ",場景"
    conversation_history=""
    conversation_file = f"./scene_file/conversation.txt"
    if os.stat(conversation_file).st_size == 0:
        conversation_history=""
    else:
        conversation_history = rag( keyword, conversation_file )


    #### load story txt
    story_txt = "./story_background/story.txt"
    story_txt_summary = rag( keyword, story_txt )

    scene_prompt = story_txt_summary + "\n" + conversation_history + "\n" + scene_prompt + "，回答以下問題:" + action
    with open('./scene_file/scene_description.json',encoding="utf-8") as file:
        scene_description = [json.load(file)]
    scene_response = GPT_processor(400,scene_prompt, scene_description)
    
    #### store to list
    conversation_information = {
        "m_id": len(m_list[3]),
        "sender": 1,
        "message":action
    }
    m_list[3].append(conversation_information)

    conversation_information = {
        "m_id": len(m_list[3]),
        "sender": 0,
        "message":json.loads(scene_response.choices[0].message.function_call.arguments).get("回覆")
    }
    m_list[3].append(conversation_information)


    # scene_object  = json.dumps(scene_response.choices[0].message.function_call.arguments)
    f = open("./scene_file/conversation.txt", "a",encoding="utf-8")
    f.write(f"玩家:{action}\n")
    f.write( f"場景:{ json.loads(scene_response.choices[0].message.function_call.arguments).get('回覆') }\n" )
    print(json.loads(scene_response.choices[0].message.function_call.arguments).get("回覆"))
    f.close()
    # summary_processor()
    # print(scene_object.encode('ascii').decode('unicode-escape'))
    return json.loads(scene_response.choices[0].message.function_call.arguments).get("回覆")
    # print(scene_response)
    # print(scene_response.choices[0].message.content)
    # return scene_response.choices[0].message.content

###### final_answer_creater
def final_answer_creater(id, motivation, action):
    #### load start prompt
    f = open('./final_answer_file/final_answer_prompt.txt',encoding="utf-8")
    fa_prompt = f.read()

    #### load story txt
    story_txt = "./story_background/story.txt"
    story_txt_summary = rag("結果",story_txt)

    fa_prompt = story_txt_summary + "\n" + fa_prompt
    with open('./final_answer_file/final_answer_description.json',encoding="utf-8") as file:
        final_answer_description = [json.load(file)]
    final_answer_response = GPT_processor(800,fa_prompt, final_answer_description)
    # store the story dictionary result to story.json
    # final_answer_object  = json.dumps(final_answer_response.choices[0].message.function_call.arguments)
    # f = open("./conversation_file/conversation.txt", "a",encoding="utf-8")
    # f.write(json.loads(final_answer_response.choices[0].message.function_call.arguments).get("真相"))
    # f.close()
    # summary_processor()
    # print(final_answer_object.encode('ascii').decode('unicode-escape'))
    print(json.loads(final_answer_response.choices[0].message.function_call.arguments).get("真相"))
    return json.loads(final_answer_response.choices[0].message.function_call.arguments).get("真相")

#### hint creater  
def hint_creater():
    #### load start prompt
    f = open('./story_background/hint_prompt.txt',encoding="utf-8")
    hint_prompt = f.read()


    #### load story txt
    story_txt = "./story_background/story.txt"
    story_txt_summary = rag("故事線索",story_txt)


    hint_prompt = story_txt_summary + "\n" + hint_prompt 
    with open('./story_background/hint_description.json',encoding="utf-8") as file:
        hint_description = [json.load(file)]
    hint_response = GPT_processor(200,hint_prompt, hint_description)
    
    f = open(f"./story_background/hints_history.txt", "a",encoding="utf-8")
    f.write(json.loads(hint_response.choices[0].message.function_call.arguments).get("回覆"))
    f.close()
    print( json.loads(hint_response.choices[0].message.function_call.arguments).get("回覆") )

    return json.loads(hint_response.choices[0].message.function_call.arguments).get("回覆")



























# def message_creater(id):
#     file = []
#     if id < 3:
#         file = open(f"./suspect_file/suspect_{id}/conversation.txt",encoding="utf-8")
#     else:
#         file = open(f"./scene_file/conversation.txt",encoding="utf-8")
#     conversation_list = file.readlines() #list
#     for lines in conversation_list:

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
#   .function_call.arguments).get("place")
# print(story_response.choices[0].message.content)
# story_background = story_response.choices[0].message.content
##### create information dictionary
# dictionary_response = openai.ChatCompletion.create(
#   model="gpt-3.5-turbo",
#   max_tokens=2000,
#   temperature=0.5,
#   messages=[
#         {"role": "user", "content": story_response.choices[0].message.content},
#         {"role": "user", "content": "請幫我將上述偵探小說內容根據每個角色的人格特質和線索做出一個dictionary"},
#         # {"role": "assistant", "content": "原來你是楊鈞安呀"},
#         # {"role": "user", "content": "請問我叫什麼名字？"}
#     ]
# )
# # store the dictionary to data_dictionary
# print(dictionary_response.choices[0].message.content)
# with open('data_dictionary.txt', 'w') as convert_file: 
#      convert_file.write(json.dumps(dictionary_response.choices[0].message.content))

# ##### 接收前端回傳資料 
# # from flask import Flask, request

# # app = Flask(__name__)

# # @app.route('/receive_message', methods=['POST'])
# # def receive_message():
# #     reply = request.get_json()
# #     # 处理接收到的消息
# #     return 'Message received successfully'

# ##### game loop
# while True:
#     action = input("action:")
#     f = open('data_dictionary.txt',encoding="utf-8")
#     now_dictionary = f.read()
#     game_response = openai.ChatCompletion.create(
#     model="gpt-3.5-turbo",
#     max_tokens=200,
#     temperature=0.5,
#     messages=[
#             {"role": "user", "content": story_background},
#             {"role": "user", "content": "請根據以下關係資料和上述故事內容，進行本偵探遊戲，請勿直接公布兇手身分。"+now_dictionary+" 若是資料中無法確定的資訊，請你幫我生成有邏輯和不矛盾的內容。" },
#             {"role": "user", "content": action},
#             # {"role": "assistant", "content": "原來你是楊鈞安呀"},
#             # {"role": "user", "content": "請問我叫什麼名字？"}
#         ]
#     )
#     # store the dictionary to data_dictionary
#     # print(dictionary_response.choices[0].message.content)
#     # with open('data_dictionary.txt', 'w') as convert_file: 
#     #     convert_file.write(json.dumps(dictionary_response.choices[0].message.content))
#     print(f"response: {game_response.choices[0].message.content}")
#     ##### dictionary reset
#     dictionary_response = openai.ChatCompletion.create(
#     model="gpt-3.5-turbo",
#     max_tokens=200,
#     temperature=0.5,
#     messages=[
#             {"role": "user", "content": story_background},
#             {"role": "user", "content": game_response.choices[0].message.content + " 請幫我將上述內容根據每個角色的人格特質和線索做出一個dictionary，並和以下dictionary合併成一個新的關係dictionary"+ now_dictionary },
#             # {"role": "user", "content": action},
#             # {"role": "assistant", "content": "原來你是楊鈞安呀"},
#             # {"role": "user", "content": "請問我叫什麼名字？"}
#         ]
#     )
#     # store the dictionary to data_dictionary
#     print(dictionary_response.choices[0].message.content)
#     with open('data_dictionary.txt', 'w') as convert_file: 
#         convert_file.write(json.dumps(dictionary_response.choices[0].message.content))