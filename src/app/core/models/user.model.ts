import { UserRole } from '@enum/user-role.enum';

export class User {
  email: string;
  firstName: string;
  lastName: string;
  chatbotTheme: string;

  role: UserRole;
  createdAt: string;
}
