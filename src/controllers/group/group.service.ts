import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from 'src/entity/group.entity';
import { Interaction } from 'src/entity/interaction.entity';
import { User } from 'src/entity/user.entity';
import { RoleUserInteraction } from 'src/enum/role-user-interaction';
import { Repository } from 'typeorm';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GroupService {

  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Interaction)
    private interactionRepository: Repository<Interaction>,
  ){}

  public findUserById = (id:number) => {
    return this.userRepository.findOne({
      where: {
        id,
        is_active: true
      }
    });
  }

  public createGroup = (data: {title: string, description?: string}) => {
    const groupData = this.groupRepository.create({...data, id: uuidv4()});
    return this.groupRepository.save(groupData);
  }

  public createInteraction = (data: {group_from: Group, user_to: User, role?: RoleUserInteraction}) => {
    const interactionData = this.interactionRepository.create(data);
    return this.interactionRepository.save(interactionData);
  }

  public findGroupById = (id:string) => {
    return this.groupRepository.findOne({
      where: {
        id
      },
      relations: {
        interactions_from: {
          user_to: true
        }
      }
    });
  }

  public findAllInteractionsByGroup = (group: Group) => {
    return this.interactionRepository.find({
      where: {
        group_from:{
          id: group.id
        }
      },
      relations: {
        user_to: true
      }
    });
  }
}
