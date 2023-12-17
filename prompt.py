import openai
import os
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

MODEL = "gpt-3.5-turbo"


def GPT_response(system_message, user_message):
    response = openai.ChatCompletion.create(
        model=MODEL,
        max_tokens=1200,
        temperature= 0.9,    ## 調高一點
        messages=[{"role": "system", "content": system_message},
                  {"role": "user", "content": user_message}
                  ],
    )
    return response


def rich_character():
    with open('./character/prompts/rich_prompt_L2M.txt',encoding="utf-8") as f:
        prompt = f.read()

    with open('./stories/dict_L2M6.txt',encoding="utf-8") as f:
        story = f.read()

    prompt = prompt + story

    response = GPT_response(prompt, "請豐富三個嫌疑人的個人資訊。")
    print(response.choices[0]['message']['content'])

    with open('./character/data/rich_dict_L2M6.txt', 'w',encoding="utf-8") as f:
        f.write(response.choices[0]['message']['content'])

def character():
    character_name = "你需要假扮的嫌疑人為維多利亞"
    with open('./character/prompts/char_prompt_L7M.txt',encoding="utf-8") as f:
        prompt = f.read()

    with open('./stories/dict_L2M5.txt',encoding="utf-8") as f:
        story = f.read()

    with open('./character/data/rich_dict_L2M5.txt', 'r',encoding="utf-8") as f:
        rich = f.read()

    prompt = prompt + character_name + story

    response = GPT_response(prompt, "你問案發當晚你在哪裡？")
    print(response.choices[0]['message']['content'])
    
def rich_place():
    with open('./place/prompts/place_prompt_L2M.txt',encoding="utf-8") as f:
        prompt = f.read()

    with open('./stories/dict_CoT2.txt',encoding="utf-8") as f:
        story = f.read()

    system_prompt = prompt 
    user_prompt = "我將給你一段偵探故事，請你幫我豐富案發現場的資訊。" + story
    response = GPT_response(system_prompt, user_prompt)
    print(response.choices[0]['message']['content'])
    with open('./place/data/place_dict_CoT2.txt', 'w',encoding="utf-8") as f:
        f.write(response.choices[0]['message']['content'])

def summary():
    with open('./summary/prompts/sum_prompt_L2M.txt',encoding="utf-8") as f:
        prompt = f.read()

    with open('./stories/dict_L2M7.txt',encoding="utf-8") as f:
        story = f.read()

    system_prompt = prompt 
    user_prompt = "我將給你一段偵探故事，請你幫我進行總結。" + story
    response = GPT_response(system_prompt, user_prompt)
    print(response.choices[0]['message']['content'])
    with open('./summary/data/sum_dict_L2M7.txt', 'w',encoding="utf-8") as f:
        f.write(response.choices[0]['message']['content'])