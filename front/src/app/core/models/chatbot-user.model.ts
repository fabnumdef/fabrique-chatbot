import { ChatbotUserRole } from '@enum/chatbot-user-role.enum';

export class ChatbotUser {
  email: string;
  firstName: string;
  lastName: string;
  role: ChatbotUserRole;
}
