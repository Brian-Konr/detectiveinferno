import openai
import json

#### openai processor
def GPT_processor(message, function_description):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        max_tokens=2000,
        temperature=0.5,
        messages=[{"role": "user", "content": message}],
        functions=function_description,
        function_call = "auto"
    )
    return response

###### game creator
def story_creater():
    #### load start prompt
    f = open('./story_background/start_prompt.txt',encoding="utf-8")
    start_prompt = f.read()
    with open('./story_background/story_background_description.json',encoding="utf-8") as file:
        story_background_description = [json.load(file)]
    story_response = GPT_processor(start_prompt, story_background_description)
    # store the story dictionary result to story.json
    story_object  = json.dumps(story_response.choices[0].message.function_call.arguments)
    print(story_object.encode('ascii').decode('unicode-escape'))
    with open("./story_background/story.json", "w") as outfile:
        outfile.write(story_object)
    return story_response.choices[0].message.function_call.arguments


###### suspect creater
def suspect_creater(target,action):
    #### load start prompt
    f = open('./suspect_file/suspect_prompt.txt',encoding="utf-8")
    suspect_prompt = f.read()
    suspect_prompt = suspect_prompt + " 你現在是嫌疑人:" + target +"，回答以下問題：" + action
    with open('./suspect_file/suspect_description.json',encoding="utf-8") as file:
        suspect_description = [json.load(file)]
        
        
    suspect_response = GPT_processor(suspect_prompt, suspect_description)
    # store the story dictionary result to story.json
    suspect_object  = json.dumps(suspect_response.choices[0].message.function_call.arguments)
    print(suspect_object.encode('ascii').decode('unicode-escape'))
    return suspect_response.choices[0].message.function_call.arguments
    # store the reply
    # with open("./story_background/suspect.json", "w") as outfile:
    #     outfile.write(story_object)
    
    
###### scene_creater
def scene_creater(action):
    #### load start prompt
    f = open('./scene_file/scene_prompt.txt',encoding="utf-8")
    scene_prompt = f.read()
    scene_prompt = scene_prompt + "，回答以下問題:" + action
    with open('./scene_file/scene_description.json',encoding="utf-8") as file:
        scene_description = [json.load(file)]
        
        
    scene_response = GPT_processor(scene_prompt, scene_description)
    # store the story dictionary result to story.json
    scene_object  = json.dumps(scene_response.choices[0].message.function_call.arguments)
    print(scene_object.encode('ascii').decode('unicode-escape'))
    return scene_response.choices[0].message.function_call.arguments


###### final_answer_creater
def final_answer_creater(id, motivation, action):
    #### load start prompt
    f = open('./final_answer_file/final_answer_prompt.txt',encoding="utf-8")
    fa_prompt = f.read()
    with open('./final_answer_file/final_answer_description.json',encoding="utf-8") as file:
        final_answer_description = [json.load(file)]
        
        
    final_answer_response = GPT_processor(final_answer_prompt, final_answer_description)
    # store the story dictionary result to story.json
    final_answer_object  = json.dumps(final_answer_response.choices[0].message.function_call.arguments)
    print(final_answer_object.encode('ascii').decode('unicode-escape'))
    return final_answer_response.choices[0].message.function_call.arguments
    

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
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