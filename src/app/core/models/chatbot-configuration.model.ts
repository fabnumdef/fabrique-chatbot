import { ChatbotUser } from '@model/chatbot-user.model';

export class ChatbotConfiguration {
  file: File;
  users: ChatbotUser[];
  name: string;
  function: string;
  icon: File;
  problematic: string;
  audience: string;
  intraDef: boolean;
  primaryColor: string;
  secondaryColor: string;
}
