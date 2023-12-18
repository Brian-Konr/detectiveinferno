import axios from 'axios';

// Define request and response types
// Define response types
type StoryResponse = {
  data: {
    background: string;
    title: string;
  };
};

type Avatar = {
  姓名: string;
  性別: string;
  關係: string;
};

type AvatarsResponse = Avatar[];

type Message = {
  m_id: number;
  sender: number;
  message: string;
  timestamp?: string;
};

type MessageResponse = {
  data: Message[];
};

type PushMessageRequest = {
  目標: string;
  行動: string;
};

type PushMessageResponse = {
  data: string;
};

type SceneResponse = {
  data: string;
};

type SceneQueryRequest = {
  目標: string;
  行動: string;
};

type EvaluationRequest = {
  ID: number;
  動機: string;
  作案手法: string;
};

type EvaluationResponse = {
  data: {
    isCorrect: boolean;
    story: string;
  };
};

type HintResponse = {
  data: string;
};

// Create axios instance
const api = axios.create({
  baseURL: '/api',
});

// Define API methods
export const getMessages = (id: number) => api.get<MessageResponse>(`/messages/${id}`);
export const pushMessage = (id: number, body: PushMessageRequest) =>
  api.post<PushMessageResponse>(`/messages/push/${id}`, body);
export const getScenes = () => api.get<SceneResponse>('/scenes');
export const pushSceneQuery = (body: SceneQueryRequest) => api.post<SceneResponse>('/scenes', body);
export const postEvaluation = (body: EvaluationRequest) => api.post<EvaluationResponse>('/evaluations', body);
export const getHints = () => api.get<HintResponse>('/stories/hints');
export const getStory = () => api.get<StoryResponse>('/stories');
export const getAvatars = () => api.get<AvatarsResponse>('/avatars');
