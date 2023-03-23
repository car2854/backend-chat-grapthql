import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from 'src/entity/group.entity';
import { Interaction } from 'src/entity/interaction.entity';
import { User } from 'src/entity/user.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class InteractionService {
  constructor(
    @InjectRepository(Interaction)
    private interactionRepository: Repository<Interaction>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Group)
    private groupRepository: Repository<Group>
  ){}

  findAllInteraction(): Promise<Interaction[]> {
    return this.interactionRepository.find();
  }

  findUserById(id:number){
    return this.userRepository.findOne({
      where: {
        id,
        is_active: true
      },
      order: {
        created_at: 'DESC'
      }
    });
  }

  findUserByUidProfile(uid:string){
    return this.userRepository.findOne({
      where: {
        uid_profile: uid,
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
        user_from: {
          image: true
        },
        user_to: {
          image: true
        },
        group_from: {
          image: true
        }
      }
    })
  }

  findInteractionGroupByUser(user: User, group: Group){

    return this.interactionRepository.findOne({
      where: [
        {
          group_from: {
            id: group.id
          },
          user_to: {
            id: user.id
          }
        },
      ],
      relations: {
        user_to: true,
        group_from: {
          image: true
        }
      }
    })
  }

  findUserInteractionByUserAuth(user: User, userName: string = ''){

    return this.interactionRepository.find({
      where: [
        {
          user_from: {
            id: user.id,
          },
          user_to: {
            name: ILike(`%${userName}%`)
          }
        },
        {
          user_to: {
            id: user.id,
          },
          user_from: {
            name: ILike(`%${userName}%`)
          }
        },
        {
          user_to: {
            id: user.id,
          },
          group_from: {
            title: ILike(`%${userName}%`)
          }
        },
      ],
      relations: {
        user_from: {
          image: true
        },
        user_to: {
          image: true
        },
        group_from: {
          image: true
        },
      }
    })
  }

  createInteraction(user1: User, user2: User){
    const interactionData = this.interactionRepository.create({user_from: user1, user_to: user2});
    return this.interactionRepository.save(interactionData);
  }

  findGroupById(id:string){
    return this.groupRepository.findOne({
      where: {
        id
      }
    })
  }
}
