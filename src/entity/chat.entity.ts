import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "./group.entity";
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
  
  @ManyToOne((_) => User, (User) => User.chat_to, {cascade: true, nullable: true})
  @JoinColumn({name: 'user_to_id'})
  @Field((type) => User, {nullable: true})
  user_to: User;

  @ManyToOne((_) => Group, (Group) => Group.chats_to, {cascade: true, nullable: true})
  @JoinColumn({name: 'group_to'})
  @Field((type) => Group, {nullable: true})
  group_to: Group;

}