import { ChatbotStatus } from '../enums/chatbot-status.enum';

export class Chatbot {
  id: number;
  name: string;
  icon: string;
  file: string;
  primaryColor: string;
  secondaryColor: string;
  problematic: string;
  audience: string;
  solution: string;
  ipAdress: string;
  status: ChatbotStatus;
  createdAt: string;
}
