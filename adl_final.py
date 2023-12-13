import openai
import json
#### load 
with open('prompt.json',encoding="utf-8") as prompt_file:
    prompt = json.load(prompt_file)
f = open('special_prompt.txt',encoding="utf-8")
text = f.read()
# print(text)
print("start game")
start_game_prompt = prompt["start_prompt"]["system_setting"] + prompt["start_prompt"]["basic_setting"] + prompt["start_prompt"]["game_setting"]
print(start_game_prompt)


###### game creator
story_response = openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  max_tokens=3000,
  temperature=0.5,
  messages=[
        {"role": "user", "content": text},
        # {"role": "assistant", "content": "原來你是楊鈞安呀"},
        # {"role": "user", "content": "請問我叫什麼名字？"}
    ]
)
print(story_response.choices[0].message.content)
story_background = story_response.choices[0].message.content
##### create information dictionary
dictionary_response = openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  max_tokens=2000,
  temperature=0.5,
  messages=[
        {"role": "user", "content": story_response.choices[0].message.content},
        {"role": "user", "content": "請幫我將上述偵探小說內容根據每個角色的人格特質和線索做出一個dictionary"},
        # {"role": "assistant", "content": "原來你是楊鈞安呀"},
        # {"role": "user", "content": "請問我叫什麼名字？"}
    ]
)
# store the dictionary to data_dictionary
print(dictionary_response.choices[0].message.content)
with open('data_dictionary.txt', 'w') as convert_file: 
     convert_file.write(json.dumps(dictionary_response.choices[0].message.content))

##### 接收前端回傳資料 
# from flask import Flask, request

# app = Flask(__name__)

# @app.route('/receive_message', methods=['POST'])
# def receive_message():
#     reply = request.get_json()
#     # 处理接收到的消息
#     return 'Message received successfully'

##### game loop
while True:
    action = input("action:")
    f = open('data_dictionary.txt',encoding="utf-8")
    now_dictionary = f.read()
    game_response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    max_tokens=200,
    temperature=0.5,
    messages=[
            {"role": "user", "content": story_background},
            {"role": "user", "content": "請根據以下關係資料和上述故事內容，進行本偵探遊戲，請勿直接公布兇手身分。"+now_dictionary+" 若是資料中無法確定的資訊，請你幫我生成有邏輯和不矛盾的內容。" },
            {"role": "user", "content": action},
            # {"role": "assistant", "content": "原來你是楊鈞安呀"},
            # {"role": "user", "content": "請問我叫什麼名字？"}
        ]
    )
    # store the dictionary to data_dictionary
    # print(dictionary_response.choices[0].message.content)
    # with open('data_dictionary.txt', 'w') as convert_file: 
    #     convert_file.write(json.dumps(dictionary_response.choices[0].message.content))
    print(f"response: {game_response.choices[0].message.content}")
    ##### dictionary reset
    dictionary_response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    max_tokens=200,
    temperature=0.5,
    messages=[
            {"role": "user", "content": story_background},
            {"role": "user", "content": game_response.choices[0].message.content + " 請幫我將上述內容根據每個角色的人格特質和線索做出一個dictionary，並和以下dictionary合併成一個新的關係dictionary"+ now_dictionary },
            # {"role": "user", "content": action},
            # {"role": "assistant", "content": "原來你是楊鈞安呀"},
            # {"role": "user", "content": "請問我叫什麼名字？"}
        ]
    )
    # store the dictionary to data_dictionary
    print(dictionary_response.choices[0].message.content)
    with open('data_dictionary.txt', 'w') as convert_file: 
        convert_file.write(json.dumps(dictionary_response.choices[0].message.content))