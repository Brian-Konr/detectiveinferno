// AvatarContext.tsx
import React, { createContext, useState } from 'react';
import { IAvatarState, IAvatar, Sender, IChatMessage } from '../@types/avatar';

interface IAvatarContext {
  avatarState: IAvatarState;
  updateChatHistory: (message: IChatMessage, avatarId: number) => void;
  setCurrentAvatar: (avatarId: number) => void;
  updateAvatar: (avatar: IAvatar) => void;
}

const AvatarContext = createContext<IAvatarContext | undefined>(undefined);

const AvatarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const fakeAvatars = getFakeAvatars();
  const updateChatHistory = (message: IChatMessage, avatarId: number) => {
    const newAvatars = avatarState.avatars.map((avatar) => {
      if (avatar.id === avatarId) {
        avatar.chatHistory.push(message);
      }
      return avatar;
    });
    setAvatarState({
      ...avatarState,
      avatars: newAvatars,
    });
  };
  const setCurrentAvatar = (avatarId: number) => {
    const newCurrentAvatar = avatarState.avatars.find(
      (avatar) => avatar.id === avatarId,
    );
    if (newCurrentAvatar) {
      setAvatarState({
        ...avatarState,
        currentAvatar: newCurrentAvatar,
      });
    }
  };
  const updateAvatar = (avatar: IAvatar) => {
    const newAvatars = avatarState.avatars.map((oldAvatar) => {
      if (oldAvatar.id === avatar.id) {
        return avatar;
      }
      return oldAvatar;
    });
    setAvatarState({
      ...avatarState,
      avatars: newAvatars,
    });
  };
  const [avatarState, setAvatarState] = useState<IAvatarState>({
    avatars: fakeAvatars,
    currentAvatar: fakeAvatars[0],
  });
  return (
    <AvatarContext.Provider
      value={{
        avatarState,
        updateAvatar,
        updateChatHistory,
        setCurrentAvatar,
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
          sender: Sender.Suspect,
          message: 'Hello how can I help you?',
        },
        {
          id: 1,
          sender: Sender.Player,
          message: 'I need your help',
        },
      ],
    },
    {
      id: 2,
      name: 'Avatar 2',
      relationship: 'Friend',
      chatHistory: [
        {
          id: 0,
          sender: Sender.Suspect,
          message: 'Hello how can I help you?',
        },
        {
          id: 1,
          sender: Sender.Player,
          message: 'I need your help',
        },
      ],
    },
    {
      id: 3,
      name: 'Avatar 3',
      relationship: 'Friend',
      chatHistory: [
        {
          id: 0,
          sender: Sender.Suspect,
          message: 'Hello how can I help you?',
        },
        {
          id: 1,
          sender: Sender.Player,
          message: 'I need your help',
        },
      ],
    },
    {
      id: 4,
      name: 'Avatar 4',
      relationship: 'Friend',
      chatHistory: [
        {
          id: 0,
          sender: Sender.Suspect,
          message: 'Hello how can I help you?',
        },
        {
          id: 1,
          sender: Sender.Player,
          message: 'I need your help',
        },
      ],
    },
    {
      id: 5,
      name: 'Avatar 5',
      relationship: 'Friend',
      chatHistory: [
        {
          id: 0,
          sender: Sender.Suspect,
          message: 'Hello how can I help you?',
        },
        {
          id: 1,
          sender: Sender.Player,
          message: 'I need your help',
        },
      ],
    },
    {
      id: 6,
      name: 'Avatar 6',
      relationship: 'Friend',
      chatHistory: [
        {
          id: 0,
          sender: Sender.Suspect,
          message: 'Hello how can I help you?',
        },
        {
          id: 1,
          sender: Sender.Player,
          message: 'I need your help',
        },
      ],
    },
  ];
  return avatars;
};
export { AvatarContext, AvatarProvider };
