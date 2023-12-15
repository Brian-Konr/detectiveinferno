from flask import Flask,jsonify,request
import json
from AI_processor import story_creater, suspect_creater, scene_creater, final_answer_creater

app = Flask(__name__)
story_json = {}

@app.route('/api/stories',methods=['GET']) # spend 2~3 min
def GET_story():
    # print("hi")
    # return "Hello"
    story_json = story_creater()
    story_overview = json.loads(story_json).get("故事大綱")
    # print(story_overview.encode('ascii').decode('unicode-escape'))
    return jsonify({"data":story_overview})
    # return "Hello"

@app.route('/api/avatars',methods=['GET'])
def GET_avatars():
    f = open("./story_background/story.json")
    story_json = json.load(f)
    avatars_overview = json.loads(story_json).get("嫌疑人")
    print(avatars_overview)
    return jsonify(avatars_overview)

@app.route('/api/push',methods=['POST'])   
def POST_push():
    try:
        request_data = request.get_json()
        suspect_reply = suspect_creater(request_data["目標"],request_data["行動"])
        print(f"request: {request_data}")
        response_data = {"data":suspect_reply}
        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/scenes',methods=['GET'])
def GET_scenes(): ### 是否是要犯罪場景
    f = open("./story_background/story.json")
    story_json = json.load(f)
    scene = json.loads(story_json).get("場景")
    print(scene["概述"])
    return jsonify({"data":scene["概述"]})

@app.route('/api/scenes',methods=['POST'])   
def POST_scenes():
    try:
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
        request_data = request.get_json()
        print(f"request: {request_data}")
        f = open("./story_background/story.json")
        story_json = json.load(f)
        murderer = json.loads(story_json).get("結果")["犯人"]
        
        suspects_list = json.loads(story_json).get("嫌疑人") # list
        isCorrect = False
        if suspects_list[ int(request_data["ID"]) - 1]["姓名"] == murderer:
            isCorrect = True
        print("here")
        answer_reply= final_answer_creater(request_data["ID"],request_data["動機"],request_data["作案手法"])
        response_data = {"data":{"isCorrect":isCorrect,"story":answer_reply}}
        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

app.run(debug=True)