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

  public findInteractionById = (id:number) => {
    return this.interactionRepository.findOne({
      where: {
        id
      },
      relations: {
        group_from: true
      }
    })
  }

  public findInteractionByUserGroup = (user: User, group: Group) => {

    return this.interactionRepository.findOne({
      where: {
        user_to:{
          id : user.id
        },
        group_from: {
          id: group.id
        }
      }
    })
  }

  public updateInteraction = (id:number, data:any) => {
    return this.interactionRepository.update(id, data);
  }

  public findInteractionByUserUidAndUser = (userUid: User, user: User) => {
    return this.interactionRepository.findOne({
      where: [
        {
          user_from: {
            id: userUid.id
          },
          user_to: {
            id: user.id
          }
        },
        {
          user_from: {
            id: user.id
          },
          user_to: {
            id: userUid.id
          }
        }
      ],
      relations: {
        user_from: true,
        user_to: true
      }
    })
  }

  public findUserByUidProfile = (uid:string) => {
    return this.userRepository.findOne({
      where: {
        uid_profile: uid,
        is_active: true
      }
    })
  }

  public deleteInteraction = (id:number) => {
    return this.interactionRepository.delete(id);
  }

  public updateGroup = (id:string, data:{title?:string, description?:string, allow_image?:boolean, only_mod_host?:boolean}) => {
    return this.groupRepository.update(id, data);
  }
  
}
