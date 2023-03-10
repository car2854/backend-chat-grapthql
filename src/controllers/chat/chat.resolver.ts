import { BadRequestException, NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { Chat } from 'src/entity/chat.entity';
import { Interaction } from 'src/entity/interaction.entity';
import { User } from 'src/entity/user.entity';
import { AuthGuard } from 'src/guard/auth.guard';
import { ChatService } from './chat.service';
import { NewChatGroupInput } from './dto/new-chat-group.input';
import { NewChatInput } from './dto/new-chat.input';

@Resolver()
export class ChatResolver {

  constructor(
    private chatService: ChatService
  ){}
  
  @UseGuards(AuthGuard)
  @Query((returns) => [Chat])
  async getChats(
    @Args('id', {type: () => Int}) id:number,
    @Context('uid') uid:number
  ){

    const [user1, user2] = await Promise.all([
      this.chatService.finduserById(uid),
      this.chatService.finduserById(id),
    ]);

    if (!user1) throw new NotFoundException('Usted no esta registrado');
    if (!user2) throw new NotFoundException('No existe el Usuario al que intenta comunicarse');

    const message = await this.chatService.findAllChatByUser(user1, user2);

    return message;

  }

  @UseGuards(AuthGuard)
  @Query((returns) => [Chat])
  async getChatsGroup(
    @Args('id', {type: () => String!}) id:string,
    @Context('uid') uid:number
  ){
    const [user, group] = await Promise.all([
      this.chatService.finduserById(uid),
      this.chatService.findGroupById(id),
    ]);
    if (!user) throw new NotFoundException('Usted no esta registrado');
    if (!group) throw new NotFoundException('No existe este grupo');
    if (!group.interactions_from.some((interacion: Interaction) => interacion.user_to.id === user.id)) throw new BadRequestException('Usted no pertenece a este grupo')
    const messages = await this.chatService.findAllChatByGroup(group);
    return messages;
  }

  @UseGuards(AuthGuard)
  @Mutation((returns) => Chat)
  async createChat(
    @Args('newChatInput') newChatInput: NewChatInput,
    @Context('uid') uid:number
  ){

    const [userFrom, userTo] = await Promise.all([
      this.chatService.finduserById(uid),
      this.chatService.finduserById(newChatInput.userTo)
    ]);

    if (!userFrom) throw new NotFoundException('Usted no esta registrado');
    if (!userTo) throw new NotFoundException('No existe el Usuario al que intenta comunicarse')

    const interaction = await this.chatService.findInteractionByUsers(userFrom, userTo);
    if (!interaction) throw new NotFoundException('No hay una interaccion con este usuario');

    if (['locked'].includes(interaction.status_from)){
      throw new BadRequestException(interaction.status_from)
    }
    if (['locked'].includes(interaction.status_to)){
      throw new BadRequestException(interaction.status_to)
    }

    const chat = await this.chatService.createChat(newChatInput.message, userFrom, userTo);
    return chat;

  }

  @UseGuards(AuthGuard)
  @Mutation((returns) => Chat)
  async createChatGroup(
    @Context('uid') uid:number,
    @Args('newChatGroupInput') newChatGroupInput: NewChatGroupInput
  ){

    const user = await this.chatService.finduserById(uid);
    if (!user) throw new NotFoundException('Usted no esta registrado');

    const group = await this.chatService.findGroupById(newChatGroupInput.groupTo);
    if (!group) throw new NotFoundException('No existe este grupo');

    if (!group.interactions_from.some((interacion: Interaction) => interacion.user_to.id === user.id)) throw new BadRequestException('Usted no pertenece a este grupo')

    const chat = await this.chatService.createChatGroup({
      message: newChatGroupInput.message,
      group_to: group,
      user_from: user
    });

    return chat;

  }
}
