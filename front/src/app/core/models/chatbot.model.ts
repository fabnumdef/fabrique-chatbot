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
  domainName: string;
  status: ChatbotStatus;
  createdAt: string;
  frontBranch: string;
  backBranch: string;
  botBranch: string;
  apiKey: string;
}
