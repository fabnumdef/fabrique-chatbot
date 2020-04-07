import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChatbotStatus } from "@enum/chatbot-status.enum";
import { User } from "@entity/user.entity";

@Entity('chatbot')
export class Chatbot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  file: string;

  @Column({ nullable: false })
  primary_color: string;

  @Column({ nullable: false })
  secondary_color: string;

  @Column({ nullable: false })
  problematic: string;

  @Column({ nullable: false })
  audience: string;

  @Column({ nullable: false })
  solution: string;

  @Column( { nullable: true })
  ip_adress: string;

  @Column( { default: false })
  intra_def: boolean;

  @Column('enum', { name: 'status', enum: ChatbotStatus, default: ChatbotStatus.pending, nullable: false})
  status: ChatbotStatus;

  @ManyToOne(type => User, user => user.chatbots)
  user: User;

  @CreateDateColumn({type: "timestamp"})
  created_at: number;
}
