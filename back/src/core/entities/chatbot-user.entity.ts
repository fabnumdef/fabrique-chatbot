import { Entity, Column, CreateDateColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Chatbot } from "@entity/chatbot.entity";
import { ChatbotUserRole } from "@enum/chatbot-user-role.enum";

@Entity('chatbot_user')
export class ChatbotUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 200})
  email: string;

  @Column({nullable: false, length: 50})
  first_name: string;

  @Column({nullable: false, length: 50})
  last_name: string;

  @Column('enum', {name: 'role', enum: ChatbotUserRole, default: ChatbotUserRole.writer, nullable: false})
  role: ChatbotUserRole;

  @ManyToOne(type => Chatbot, chatbot => chatbot.users)
  chatbot: Chatbot;

  @CreateDateColumn({type: "timestamp"})
  created_at: number;
}
