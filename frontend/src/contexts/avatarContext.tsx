// AvatarContext.tsx
import React, { createContext, useEffect, useState } from 'react';
import { IAvatar, Sex, IChatMessage, Sender } from '../types/Avatar';
import { getAvatars, getMessages, getScenes } from '../agent';

const MAX_SCENE_SUMMARY_LENGTH = 14;
export interface IAvatarContextType {
  avatars: IAvatar[];
  updateAvatar: (avatar: IAvatar) => void;
  updateChatHistory: (message: IChatMessage, avatarId: number) => void;
  loading: boolean;
  reset: () => void;
}

const AvatarContext = createContext<IAvatarContextType | undefined>(undefined);

const AvatarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [avatars, setAvatars] = useState<IAvatar[]>([]);
  const [loading, setLoading] = useState(true);
  const updateChatHistory = (message: IChatMessage, avatarId: number) => {
    const newAvatars = avatars.map((avatar) => {
      if (avatar.id === avatarId) {
        avatar.chatHistory.push(message);
      }
      return avatar;
    });
    setAvatars(newAvatars);
  };
  const updateAvatar = (avatar: IAvatar) => {
    const newAvatars = avatars.map((oldAvatar) => {
      if (oldAvatar.id === avatar.id) {
        return avatar;
      }
      return oldAvatar;
    });
    setAvatars(newAvatars);
  };

  const reset = () => {
    setAvatars([]);
    setLoading(true);
  };

  useEffect(() => {
    if (loading) {
      const fetchAvatars = async () => {
        try {
          const { data: avatarsResponse } = await getAvatars();
          const chatHistories = await Promise.all([0, 1, 2, 3].map((avatarId) => fetchChatHistory(avatarId)));
          const sceneSummary = (await getScenes()).data.data;
          let id = 0;
          const avatars = avatarsResponse.map((avatar) => {
            const mappedAvatar: IAvatar = {
              id,
              name: avatar.姓名,
              relationship: avatar.關係,
              chatHistory: chatHistories[id],
              sex: avatar.性別 as Sex,
              isSuspect: true,
            };
            id++;
            return mappedAvatar;
          });
          // also add the scene bot
          avatars.push({
            id,
            name: '場景',
            relationship:
              sceneSummary.length > MAX_SCENE_SUMMARY_LENGTH
                ? sceneSummary.slice(0, MAX_SCENE_SUMMARY_LENGTH) + '...'
                : sceneSummary,
            chatHistory: chatHistories[id],
            sex: Sex.Male,
            isSuspect: false,
          });
          setAvatars(avatars);
          setLoading(false);
        } catch (error) {
          console.error(`Filed to fetch avatars: ${error}`);
        }
      };
      fetchAvatars();
    }
  }, [loading]);

  const fetchChatHistory = async (avatarId: number): Promise<IChatMessage[]> => {
    const { data: chatHistoryResponse } = await getMessages(avatarId);
    const chatHistory = chatHistoryResponse.data;
    return chatHistory.map((message) => {
      return {
        id: message.m_id,
        sender: message.sender === 0 ? Sender.Npc : Sender.Player,
        content: message.message,
      };
    });
  };
  return (
    <AvatarContext.Provider
      value={{
        avatars,
        updateAvatar,
        updateChatHistory,
        loading,
        reset,
      }}
    >
      {children}
    </AvatarContext.Provider>
  );
};

export { AvatarContext, AvatarProvider };
