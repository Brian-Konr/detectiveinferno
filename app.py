from flask import Flask,jsonify,request
import json
import os
from AI_processor import story_creater, suspect_creater, scene_creater, final_answer_creater, hint_creater
import AI_processor
print(AI_processor.m_list)
app = Flask(__name__)
story_json = {}
def checker():
    if os.stat("./story_background/story.json").st_size == 0:
        story_json = story_creater()
        print("no story !!")
        return story_json
    else:
        print("story has already fetched")
        f = open("./story_background/story.json")
        story_json = json.load(f)
        return story_json


def cleaner():
    AI_processor.m_list=[[],[],[],[]]
    open("./story_background/story.json", 'w').close()
    open("./story_background/story.txt", 'w').close()
    open("./story_background/hints_history.txt", 'w').close()
    open("./suspect_file/suspect_0/conversation.txt", 'w').close()
    open("./suspect_file/suspect_1/conversation.txt", 'w').close()
    open("./suspect_file/suspect_2/conversation.txt", 'w').close()
    open("./scene_file/conversation.txt", 'w').close()


@app.route('/api/stories',methods=['GET']) # spend 2~3 min
def GET_story():
    story_json = checker()
    story_overview = json.loads(story_json).get("故事大綱")
    story_title = json.loads(story_json).get("標題")
    print(story_overview)
    print(story_title)
    # print(story_overview.encode('ascii').decode('unicode-escape'))
    return jsonify({"data":story_overview,"title":story_title})


@app.route('/api/avatars',methods=['GET'])
def GET_avatars():
    story_json = checker()
    avatars_overview = json.loads(story_json).get("嫌疑人資訊")
    print(avatars_overview)
    return jsonify(avatars_overview)


@app.route('/api/messages/<id>',methods=['GET'])   # id 0~2 are the suspects, id 3 is the scene
def GET_messages(id):
    try:
        story_json = checker()
        response_data = {"data":AI_processor.m_list[int(id)]}
        print(response_data)
        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/messages/push/<id>',methods=['POST'])   
def POST_push(id):
    # try:
    story_json = checker()
    request_data = request.get_json()
    suspect_reply = suspect_creater(int(id), request_data["目標"], request_data["行動"])
    print(f"request: {request_data}")
    response_data = {"data":suspect_reply}
    return jsonify(response_data), 200
    #except Exception as e:
    #    return jsonify({"error": str(e)}), 500


@app.route('/api/scenes',methods=['GET'])
def GET_scenes(): ### 是否是要犯罪場景
    story_json = checker()
    scene = json.loads(story_json).get("場景")
    print(scene["概述"])
    return jsonify({"data":scene["概述"]})


@app.route('/api/scenes',methods=['POST'])   
def POST_scenes():
    try:
        story_json = checker()
        request_data = request.get_json()
        scene_reply = scene_creater(request_data["行動"])
        print(f"request: {request_data}")
        response_data = {"data":scene_reply}
        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/evaluations',methods=['POST'])   
def POST_evaluations():
    try:
        story_json = checker()
        request_data = request.get_json()
        print(f"request: {request_data}")
        f = open("./story_background/story.json")
        story_json = json.load(f)
        murderer = json.loads(story_json).get("結果")["犯人"]
        
        suspects_list = json.loads(story_json).get("嫌疑人") # list
        isCorrect = False
        if suspects_list[ int(request_data["ID"])]["姓名"] == murderer:
            isCorrect = True
        print("here")
        answer_reply= final_answer_creater(request_data["ID"],request_data["動機"],request_data["作案手法"])
        response_data = {"data":{"isCorrect":isCorrect,"story":answer_reply}}

        ### clean the story finally 
        cleaner()

        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/stories/hints',methods=['GET'])
def GET_hints():
    story_json = checker()
    hint_reply = hint_creater()
    return jsonify({"data":hint_reply})

app.run(debug=True,port=4000)