import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/entity/chat.entity';
import { Interaction } from 'src/entity/interaction.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {

  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Interaction)
    private interactionRepository: Repository<Interaction>,
  ){}

  finduserById(id:number){
    return this.userRepository.findOne({
      where: {
        id,
        is_active: true
      }
    })
  }
  
  findInteractionByUsers(user1: User, user2: User){
    return this.interactionRepository.findOne({
      where: [
        {
          user_from: {
            id: user1.id
          },
          user_to: {
            id: user2.id
          }
        },
        {
          user_from: {
            id: user2.id
          },
          user_to: {
            id: user1.id
          }
        }
      ]
    })
  }

  findAllChatByUser(user1: User, user2: User){
    return this.chatRepository.find({
      where: [
        {
          user_from: {
            id: user1.id,
          },
          user_to: {
            id: user2.id
          }
        },
        {
          user_from: {
            id: user2.id,
          },
          user_to: {
            id: user1.id
          }
        },
      ],
      relations: {
        user_from: true,
        user_to: true
      }
    });
  }

  createChat(message:string, userFrom: User, userTo: User){
    const chatData = this.chatRepository.create({message, user_from: userFrom, user_to: userTo});
    return this.chatRepository.save(chatData);
  }
}
