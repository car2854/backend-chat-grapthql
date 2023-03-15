import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Chat } from "./chat.entity";
import { Interaction } from "./interaction.entity";

@Entity('groups')
@ObjectType()
export class Group{

  @PrimaryColumn()
  @Field((type) => String)
  id: string;

  @Column()
  @Field()
  title: string;

  @Column({type: 'text', nullable: true})
  @Field({nullable: true})
  description?: string;

  @CreateDateColumn()
  @Field()
  create_at: Date;

  @Column({type: 'boolean', default: true})
  @Field((type) => Boolean)
  allow_image: boolean;

  @Column({type: 'boolean', default: false})
  @Field((type) => Boolean)
  only_mod_host: boolean;

  @OneToMany((_) => Interaction, (Interaction) => Interaction.group_from)
  @Field((type) => Interaction)
  interactions_from: Interaction[];

  @OneToMany((_) => Chat, (Chat) => Chat.group_to)
  @Field((type) => Chat)
  chats_to: Chat[];
}