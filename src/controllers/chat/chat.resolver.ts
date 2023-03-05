import { BadRequestException, NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { Chat } from 'src/entity/chat.entity';
import { Interaction } from 'src/entity/interaction.entity';
import { User } from 'src/entity/user.entity';
import { AuthGuard } from 'src/guard/auth.guard';
import { ChatService } from './chat.service';
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

    if (['locked','silenced'].includes(interaction.status_from)){
      throw new BadRequestException(interaction.status_from)
    }
    if (['locked','silenced'].includes(interaction.status_to)){
      throw new BadRequestException(interaction.status_to)
    }

    const chat = await this.chatService.createChat(newChatInput.message, userFrom, userTo);
    return chat;

  }
}
