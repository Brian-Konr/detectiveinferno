from flask import Flask
import json
from AI_processor import story_creater,suspect_creater,scene_creater,final_answer_creater
app = Flask(__name__)
story_json = {}

@app.route('/api/stories',methods=['GET'])
def GET_story():
    story_json = story_creater()
    story_overview = json.loads(story_json).get("故事大綱")
    return jsonify({"data":story_overview})

@app.route('/api/avatars',methods=['GET'])
def GET_avatars():
    avatars_overview = json.loads(story_json).get("嫌疑人")
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
    scene = json.loads(story_json).get("場景").get("概述")
    return jsonify({"data":scene})

@app.route('/api/scenes',methods=['POST'])   
def POST_push():
    try:
        request_data = request.get_json()
        scene_reply = scene_creater(request_data["行動"])
        print(f"request: {request_data}")
        response_data = {"data":scene_reply}
        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/evaluations',methods=['POST'])   
def POST_push():
    try:
        request_data = request.get_json()
        print(f"request: {request_data}")
        murderer = json.loads(story_json).get("結果").get("犯人")
        suspects_list = json.loads(story_json).get("嫌疑人") # list
        isCorrect = False
        if suspect_list[ request_data["ID"] - 1]["姓名"] == murderer:
            isCorrect = True
        answer_reply= final_answer_creater(request_data["ID"],request_data["動機"],request_data["行動"])
        response_data = {"data":{"isCorrect":isCorrect,"story":answer_reply}}
        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

app.run()