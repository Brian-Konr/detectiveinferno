import jieba
from transformers import BertTokenizer, BertModel
from sklearn.metrics.pairwise import cosine_similarity
import torch

def load_file(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        content = file.read()
    return content

def segment_text(text):
    segments = jieba.lcut(text)
    return segments

def load_pretrained_model():
    # 使用中文BERT模型
    tokenizer = BertTokenizer.from_pretrained('bert-base-chinese')
    model = BertModel.from_pretrained('bert-base-chinese')
    return tokenizer, model

def calculate_similarity(query, tokenizer, model, segments):
    inputs = tokenizer(segments, return_tensors="pt", padding=True, truncation=True, max_length=128)
    with torch.no_grad():
        outputs = model(**inputs)
    
    query_embedding = model(**tokenizer(query, return_tensors="pt"))['last_hidden_state']
    query_embedding_numpy = query_embedding.detach().numpy()
    query_embedding_numpy = query_embedding_numpy.squeeze()
    similarity_scores = cosine_similarity(query_embedding_numpy, outputs['last_hidden_state'])[0]
    
    return similarity_scores

def search_similarity(filename, query):
    content = load_file(filename)
    segments = segment_text(content)
    tokenizer, model = load_pretrained_model()
    similarity_scores = calculate_similarity(query, tokenizer, model, segments)

    # 找到相似度最高的前5个小段
    top_indices = sorted(range(len(similarity_scores)), key=lambda i: similarity_scores[i], reverse=True)[:5]
    top_segments = [segments[i] for i in top_indices]

    return top_segments

# 示例用法
filename = './suspect_file/suspect_0/rich_suspect_info.txt'
query = '你有甚麼興趣嗎？,亞歷克斯'
result = search_similarity(filename, query)
print(result)
