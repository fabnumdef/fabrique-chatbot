import { Chatbot } from "@entity/chatbot.entity";
import { BotStatus } from "@enum/bot-status.enum";

export const chatbotsMock: Chatbot[] = [
  {
    id: 1,
    name: 'Jarvis',
    icon: 'icon',
    primary_color: null,
    secondary_color: null,
    file: null,
    problematic: null,
    audience: null,
    solution: null,
    ip_adress: null,
    intra_def: false,
    status: BotStatus.creation,
    user: null,
    created_at: null
  }
];
