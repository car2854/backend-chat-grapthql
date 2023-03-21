import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Chat } from "./chat.entity";
import { Group } from "./group.entity";
import { User } from "./user.entity";

@Entity('images')
@ObjectType()
export class Image{

  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;
  
  @Column()
  @Field()
  name: string;
  
  @Column()
  @Field()
  dir: string;
  
  @CreateDateColumn()
  @Field()
  created_at: Date;
  
  @OneToOne((_) => User, (User) => User.image, {cascade: true, nullable: true})
  @JoinColumn({name: 'user_id'})
  @Field((type) => User, {nullable: true})
  user: User;

  @OneToOne((_) => Chat, (Chat) => Chat.image, {cascade: true, nullable: true})
  @JoinColumn({name: 'chat_id'})
  @Field((type) => Chat, {nullable: true})
  chat: Chat;

  @OneToOne((_) => Group, (Group) => Group.image, {cascade: true, nullable: true})
  @JoinColumn({name: 'group_id'})
  @Field((type) => Group, {nullable: true})
  group: Group
}