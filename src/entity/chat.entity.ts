import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('chats')
@ObjectType()
export class Chat{

  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  message: string;

  @CreateDateColumn()
  @Field()
  create_at: Date;

  @ManyToOne((_) => User, (User) => User.chat_from, {cascade: true})
  @JoinColumn({name: 'user_from_id'})
  @Field((type) => User)
  user_from: User;
  
  @ManyToOne((_) => User, (User) => User.chat_to, {cascade: true})
  @JoinColumn({name: 'user_to_id'})
  @Field((type) => User)
  user_to: User;

}