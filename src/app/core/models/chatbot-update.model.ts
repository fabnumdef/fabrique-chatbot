import { ChatbotStatus } from '@enum/chatbot-status.enum';

export class ChatbotUpdate {
  name?: string;
  rootPassword?: string;
  ipAdress?: string;
  status?: ChatbotStatus;
  domainName?: string;
}
