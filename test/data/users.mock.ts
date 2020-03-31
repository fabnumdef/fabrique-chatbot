import { User } from "@entity/user.entity";
import { UserRole } from "@enum/user-role.enum";
const bcrypt = require('bcrypt');

export const usersMock: User[] = [
  {
    email: 'batman@gotham.fr',
    password: bcrypt.hashSync('WayneCorp', 10),
    first_name: 'Bruce',
    last_name: 'Wayne',
    chatbot_theme: 'Alfred',
    role: UserRole.user,
    chatbots: [],
    reset_password_token: null,
    reset_password_expires: null,
    created_at: null
  }
];
