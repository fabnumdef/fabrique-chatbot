import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChatbotStatus } from "@enum/chatbot-status.enum";
import { User } from "@entity/user.entity";
import { ChatbotUser } from "@entity/chatbot-user.entity";

@Entity('chatbot')
export class Chatbot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 50 })
  name: string;

  @Column({ nullable: true, length: 50 })
  function: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  file: string;

  @Column({ nullable: false, length: 20 })
  primary_color: string;

  @Column({ nullable: false, length: 20 })
  secondary_color: string;

  @Column({ nullable: false, length: 200 })
  problematic: string;

  @Column({ nullable: false, length: 200 })
  audience: string;

  @Column( { nullable: true, length: 50 })
  ip_adress: string;

  @Column( { nullable: true, length: 50 })
  domain_name: string;

  @Column( { default: false })
  intra_def: boolean;

  @Column('enum', { name: 'status', enum: ChatbotStatus, default: ChatbotStatus.pending, nullable: false})
  status: ChatbotStatus;

  @ManyToOne(type => User, user => user.chatbots)
  user: User;

  @OneToMany(type => ChatbotUser, user => user.chatbot, { cascade: true })
  users: ChatbotUser[];

  @CreateDateColumn({type: "timestamp"})
  created_at: number;

  @Column( { default: 'master' })
  front_branch: string;

  @Column( { default: 'master' })
  back_branch: string;

  @Column( { default: 'master' })
  bot_branch: string;
}
