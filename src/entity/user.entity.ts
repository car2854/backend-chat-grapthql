import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Chat } from './chat.entity';
import { Interaction } from './interaction.entity';
import { Image } from './image.entity';

@Entity('users')
@ObjectType()
export class User{
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;
  
  @Column()
  @Field()
  name: string;
  
  @Column()
  @Field()
  email: string;
  
  @Column()
  @Field()
  password: string;

  @CreateDateColumn()
  @Field()
  created_at: Date;

  @Column({type: 'boolean', default: true})
  @Field()
  is_active: boolean;
  
  @Column()
  @Field()
  uid_profile: string;

  @Field({nullable: true})
  token?: string;

  @OneToMany((_) => Interaction, (Interaction) => Interaction.user_from)
  @Field((type) => [Interaction], {nullable: true})
  interactions_from: Interaction[];

  @OneToMany((_) => Interaction, (Interaction) => Interaction.user_to)
  @Field((type) => [Interaction], {nullable: true})
  interactions_to: Interaction[];
  
  @OneToMany((_) => Chat, (Chat) => Chat.user_from)
  @Field((type) => [Chat], {nullable: true})
  chat_from: Chat[];
  
  @OneToMany((_) => Chat, (Chat) => Chat.user_to)
  @Field((type) => [Chat], {nullable: true})
  chat_to: Chat[];

  @OneToOne((_) => Image, (Image) => Image.user)
  @Field((type) => Image, {nullable: true})
  image: Image;
}