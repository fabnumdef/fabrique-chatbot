import { ChatbotStatus } from '@enum/chatbot-status.enum';

export class ChatbotUpdate {
  name?: string;
  rootUser?: string;
  rootPassword?: string;
  ipAdress?: string;
  status?: ChatbotStatus;
  domainName?: string;
}
