import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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

  @ManyToOne((_) => User, (User) => User.interactions_from, {cascade: true})
  @JoinColumn({name: 'user_from'})
  @Field((type) => User)
  user_from: User;

  @ManyToOne((_) => User, (User) => User.interactions_to, {cascade: true})
  @JoinColumn({name: 'user_to'})
  @Field((type) => User)
  user_to: User;
}