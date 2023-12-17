// AvatarContext.tsx
import React, { createContext, useEffect, useState } from 'react';
import { IAvatar, Sender, IChatMessage } from '../types/Avatar';

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
    if (avatars.length > 0) {
      return;
    }
    setTimeout(() => {
      setLoading(false);
      setAvatars(getFakeAvatars());
    }, 3000);
  }, [avatars]);
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

const getFakeAvatars = () => {
  const avatars: IAvatar[] = [
    {
      id: 1,
      name: 'Avatar 1',
      relationship: 'Friend',
      chatHistory: [
        {
          id: 0,
          sender: Sender.Npc,
          content: 'Hello how can I help you?',
        },
        {
          id: 1,
          sender: Sender.Player,
          content: 'I need your help',
        },
      ],
      isSuspect: true,
    },
    {
      id: 2,
      name: 'Avatar 2',
      relationship: 'Friend',
      chatHistory: [
        {
          id: 0,
          sender: Sender.Npc,
          content: 'Hello how can I help you?',
        },
        {
          id: 1,
          sender: Sender.Player,
          content: 'I need your help',
        },
      ],
      isSuspect: true,
    },
    {
      id: 3,
      name: 'Avatar 3',
      relationship: 'Friend',
      chatHistory: [
        {
          id: 0,
          sender: Sender.Npc,
          content: 'Hello how can I help you?',
        },
        {
          id: 1,
          sender: Sender.Player,
          content: 'I need your help',
        },
      ],
      isSuspect: true,
    },
    {
      id: 4,
      name: 'Crime Theme',
      relationship: 'Find what you need!',
      chatHistory: [
        {
          id: 0,
          sender: Sender.Npc,
          content: 'Hello I am the crime theme bot',
        },
        {
          id: 1,
          sender: Sender.Player,
          content: 'What can you do?',
        },
      ],
      isSuspect: false,
    },
  ];
  return avatars;
};
export { AvatarContext, AvatarProvider };
