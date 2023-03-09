import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "./group.entity";
import { User } from "./user.entity";

@Entity('interactions')
@ObjectType()
export class Interaction{

  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column({default: 'active'})
  @Field()
  status_from: string;

  @Column({default: 'active'})
  @Field()
  status_to: string;

  @ManyToOne((_) => User, (User) => User.interactions_to, {cascade: true})
  @JoinColumn({name: 'user_to'})
  @Field((type) => User, {nullable: true})
  user_to: User;
  
  @ManyToOne((_) => User, (User) => User.interactions_from, {cascade: true, nullable: true})
  @JoinColumn({name: 'user_from'})
  @Field((type) => User, {nullable: true})
  user_from: User;

  @ManyToOne((_) => Group, (Group) => Group.interactions_from, {cascade: true, nullable: true})
  @JoinColumn({name: 'group_from'})
  @Field((type) => Group, {nullable: true})
  group_from: Group;
}