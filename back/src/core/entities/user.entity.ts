import { Entity, Column, PrimaryColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { UserRole } from "@enum/user-role.enum";
import { Chatbot } from "@entity/chatbot.entity";

@Entity('fabrique_user')
export class User {
  @PrimaryColumn({length: 200})
  email: string;

  @Column({select: false, nullable: true, length: 200})
  password: string;

  @Column({nullable: false, default: 0})
  failed_login_attempts: number;

  @Column({type: "timestamp", nullable: true})
  lock_until: number;

  @Column({nullable: false, length: 50})
  first_name: string;

  @Column({nullable: false, length: 50})
  last_name: string;

  @Column({nullable: false, length: 50})
  chatbot_theme: string;

  @Column('enum', {name: 'role', enum: UserRole, default: UserRole.user, nullable: false})
  role: UserRole;

  @OneToMany(type => Chatbot, chatbot => chatbot.user)
  chatbots: Chatbot[];

  @CreateDateColumn({type: "timestamp"})
  created_at: number;

  @Column({nullable: true})
  reset_password_token: string;

  @Column({type: "timestamp", nullable: true})
  reset_password_expires: number;
}
