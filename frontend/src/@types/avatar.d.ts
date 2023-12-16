export enum Sender {
  Suspect,
  Player,
}

interface IChatMessage {
  id: number;
  sender: Sender;
  message: string;
}

export interface IAvatar {
  id: number; // suspect id
  name: string;
  relationship: string;
  chatHistory: IChatMessage[];
}

export interface IAvatarState {
  avatars: IAvatar[];
  currentAvatar: IAvatar;
}
