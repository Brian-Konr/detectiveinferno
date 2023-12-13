# ADL_final Project
### TODOs
1. 透過 prompt 1 生成故事和人物背景 [已完成]
2. 透過 prompt 3 生成專門描述場景的AI [已完成]
3. 各個 嫌疑人專門AI [尚未處理]

# detectiveinferno
Welcome to DetectiveInferno, an immersive detective game generator and interactive storytelling platform! Dive into the world of mystery and intrigue as you investigate a crime, interrogate suspects, and unravel the secrets hidden within the narrative.

## Example Detailed Information Dictionary
```json
{
    "時間": "2022年4月10日",
    "地點": "倫敦的一個古老城堡",
    "死者": "亞瑟·康南·道爾",
    "死因": "頭部重擊",
    "嫌疑人": [
        {
            "ID": 0,
            "姓名": "瑪麗·道爾",
            "關係": "死者的妻子",
            "動機": "繼承遺產",
            "證據": "在現場找到她的手帕",
            "不在場證明": "她在案發時正在參加一個園藝活動，有多位證人可以證明"
        },
        {
            "ID": 1,
            "姓名": "約瑟夫·貝爾",
            "關係": "死者的朋友，也是一位醫生",
            "動機": "對死者的新書內容感到不滿",
            "證據": "在現場找到他的手錶",
            "不在場證明": "他在案發時正在醫院值班，有醫院的監視錄像作為證明"
        },
        {
            "ID": 2,
            "姓名": "艾倫·波伊爾",
            "關係": "死者的秘書",
            "動機": "對死者的遺囑感到不滿",
            "證據": "在現場找到他的筆記本，筆記本上有他對亞瑟的怨恨以及他計劃如何殺死亞瑟的詳細描述",
            "不在場證明": "無"
        }
    ],
    "場景": {
        "概述": "亞瑟·康南·道爾富麗堂皇的書房",
        "書桌": "亞瑟坐在書桌前，上面散落著文件和文具",
        "破碎的燈": "碎片散落在地板上",
        "安全攝影機": "安裝在走廊，錄到了一名身影",
    },
    "線索": {
        "破碎的燈": {
            "相關人物": "艾倫·波伊爾",
            "細節": "一個破碎的燈，有血跡，並且在燈的碎片上找到艾倫的指紋"
        },
    },
    "結果": {
        "犯人": "艾倫·波伊爾",
        "動機": "艾倫對亞瑟的遺囑感到不滿，認為這是對他多年的忠誠和努力的蔑視。",
        "作案過程": "艾倫在亞瑟獨自在書房工作時，趁機進入書房，用燈重擊亞瑟的頭部，導致亞瑟當場死亡。",
        "證據": "在現場，警方找到了一個破碎的燈和艾倫的筆記本，這些都成為了他的犯罪證據。在燈的碎片上找到艾倫的指紋，並且在他的筆記本上找到他對亞瑟的怨恨以及他計劃如何殺死亞瑟的詳細描述。"
    }
}

```
## Flowchart
![flowchart](image.png)

## API Documentation
### `GET /api/stories`
Returns formatted JSON
```json
{
    "data": "story information. for example, In a winter..."
}
```

### `GET /api/avatars`
Returns a list of information about all avatars
```
[
    {
        "姓名": "瑪麗·道爾",
        "關係": "死者的妻子",
    },
    {
        "姓名": "約瑟夫·貝爾",
        "關係": "死者的朋友，也是一位醫生",
    },
    {
        "姓名": "艾倫·波伊爾",
        "關係": "死者的秘書",
    }
]
```

### `POST /api/push`
Pushes a dialogue to the server
#### Request Body
```json
{
    "目標": "艾倫·波伊爾",
    "行動": "請問你在案發時在哪裡？"
}
```
#### Response Body
```json
{
    "data": "我在醫院值班，有醫院的監視錄像作為證明。"
}
```

### `GET /api/scenes`
Returns a short description of the scene
```json
{
    "data": "亞瑟·康南·道爾富麗堂皇的書房"
}
```
### `POST /api/scenes`
Pushes a scene query to the server
#### Request Body
```json
{
    "目標": "場景",
    "行動": "書房內有什麼？"
}
```
#### Response Body
```json
{
    "data": "亞瑟坐在書桌前，上面散落著文件和文具"
}
```

### `POST /api/evaluations`
Return the evaluation of the player after attempting to solve the case
#### Request Body
```json
{
    "ID": 0,
    "動機": "不滿遺產分配",
    "作案手法": "用燈重擊頭部",
}
```
#### Response Body
```json
{
    "data": {
        "isCorrect": true,
        "story": "艾倫對亞瑟的遺囑感到不滿，認為這是對他多年的忠誠和努力的蔑視。艾倫在亞瑟獨自在書房工作時，趁機進入書房，用燈重擊亞瑟的頭部，導致亞瑟當場死亡。在現場，警方找到了一個破碎的燈和艾倫的筆記本，這些都成為了他的犯罪證據。在燈的碎片上找到艾倫的指紋，並且在他的筆記本上找到他對亞瑟的怨恨以及他計劃如何殺死亞瑟的詳細描述。"
    }
}
```
