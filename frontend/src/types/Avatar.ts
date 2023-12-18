export enum Sender {
  Npc,
  Player,
}

export enum Sex {
  Male = '男',
  Female = '女',
}

export interface IChatMessage {
  id: number;
  sender: Sender;
  content: string;
}

export interface IAvatar {
  id: number; // suspect id
  name: string;
  relationship: string;
  chatHistory: IChatMessage[];
  isSuspect: boolean;
  sex: Sex;
}
