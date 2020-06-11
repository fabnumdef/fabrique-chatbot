import { ChatbotStatus } from '@enum/chatbot-status.enum';

export class Chatbot {
  id: number;
  name: string;
  function: string;
  icon: string;
  file: string;
  primaryColor: string;
  secondaryColor: string;
  problematic: string;
  audience: string;
  ipAdress: string;
  status: ChatbotStatus;
  createdAt: string;
}
