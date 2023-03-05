import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Interaction } from 'src/entity/interaction.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Interaction)
    private interactionRepository: Repository<Interaction>
  ){}

  findUserById(id:number){
    return this,this.userRepository.findOne({
      where: {
        id,
        is_active: true
      }
    });
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
        },
      ],
      relations: {
        user_from: true,
        user_to: true
      }
    });
  }

  public updateInteraction(id:number, data:any){
    return this.interactionRepository.update(id, data);
  }
}
