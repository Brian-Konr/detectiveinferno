import openai
import os
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

MODEL = "gpt-3.5-turbo"


def GPT_response(system_message, user_message):
    response = openai.ChatCompletion.create(
        model=MODEL,
        max_tokens=1380,
        temperature= 1,    ## 調高一點
        messages=[{"role": "system", "content": system_message},
                  {"role": "user", "content": user_message}
                  ],
    )
    return response


with open('./prompts/dict_prompt_L2M2.txt',encoding="utf-8") as f:
    story_prompt = f.read()

response = GPT_response(story_prompt, "產生一個具有邏輯性的偵探尋找兇手的解謎故事，以及對應故事的 knowledge dictionary。")
print(response.choices[0]['message']['content'])

with open('./data/dict_L2M7.txt', 'w',encoding="utf-8") as f:
    f.write(response.choices[0]['message']['content'])


