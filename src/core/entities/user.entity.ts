import { Entity, Column, PrimaryColumn } from 'typeorm';
import { UserRole } from "@enum/user-role.enum";

@Entity('user')
export class User {
  @PrimaryColumn()
  email: string;

  @Column({ select: false, nullable: true })
  password: string;

  @Column({ nullable: false })
  first_name: string;

  @Column({ nullable: false })
  last_name: string;

  @Column({ nullable: false })
  chatbot_theme: string;

  @Column('enum', { name: 'role', enum: UserRole, default: UserRole.user, nullable: false})
  role: UserRole;
}
