from langchain.document_loaders import TextLoader
from langchain.embeddings.sentence_transformer import SentenceTransformerEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.text_splitter import TokenTextSplitter
import os
import openai
from dotenv import load_dotenv

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
openai.api_key = os.getenv("OPENAI_API_KEY")
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY   

def search_docs(query, filename, top_k=5):
    documents = TextLoader(filename).load()
    # text_splitter = CharacterTextSplitter(chunk_size=50, chunk_overlap=10)
    text_splitter = TokenTextSplitter(chunk_size=100, chunk_overlap=10) ## 直接切有點出略，要再調整，可以用chatGPT分類來儲存
    # print(tmp)
    docs = text_splitter.split_documents(documents)
    # print(docs)
    # print(docs)
    embedding_function = SentenceTransformerEmbeddings(model_name="sentence-transformers/paraphrase-multilingual-mpnet-base-v2")
    # print(embeddings)
    db = Chroma.from_documents(docs, embedding_function)
    
    ## similarity score threshold retrieval
    # ans = db.similarity_search(query)
    # print("Similarity score")
    # print(ans[0].page_content)

    ## Top k
    retriever = db.as_retriever(search_kwargs={"k": top_k})
    ans = retriever.get_relevant_documents(query)
    # print("Top k retrieval")
    result = ""
    for i, doc in enumerate(ans):
        # print(f"Rank {i}: {doc.page_content}")
        ## concat ans
        result += doc.page_content
    return result

def GPT_response(system_message, user_message):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        max_tokens=1000,
        temperature=0.5,
        messages=[{"role": "system", "content": system_message},
                  {"role": "user", "content": user_message}
                  ],
    )
    return response

def rag(query, filename):
    # query = "維多利亞的奶奶叫什麼名字？"
    # filename = "./data/dict_CoT1.txt"
    ans = search_docs(query, filename, 5)
    return ans
# print(ans)

## concat query and ans
## 下面這個'prompt要加一些針對遊戲的描述，不能讓他直接回答不知道
# my_prompt = "我將給你一些文字敘述，請你根據這些文字敘述，以類似人的口語來回答接下來的問題。"
# system_message = my_prompt + "\n" + ans

# print(system_message)
# print(query)
# response = GPT_response(system_message=system_message, user_message=query)

# print(response.choices[0]['message']['content'])