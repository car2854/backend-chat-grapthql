import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from 'src/entity/group.entity';
import { Interaction } from 'src/entity/interaction.entity';
import { User } from 'src/entity/user.entity';
import { StatusInteractionEnum } from 'src/enum/status-interaction';
import { ILike, Not, Repository, UpdateResult } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    
    @InjectRepository(Interaction)
    private interactionRepository: Repository<Interaction>,
  ){}

  findAllUser(): Promise<User[]> {
    return this.userRepository.find({
      where: {
        is_active: true
      }
    });
  }

  findUserById(id:number): Promise<User>{
    return this.userRepository.findOne({
      where: {
        id,
        is_active: true
      }
    });
  }
  
  findUserByEmail(email:string): Promise<User>{
    return this.userRepository.findOne({
      where: {
        email
      }
    });
  }


  createUser(user: CreateUserInput): Promise<User>{
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  deleteUser(id:number): Promise<UpdateResult>{
    return this.userRepository.update(id, {is_active: false});
  }

  findUsersByUid(ref:string): Promise<User>{
    return this.userRepository.findOne({
      where:{
        uid_profile: ref
      }
    });
  }

  findGroupById = (id:string) => {
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

  findInteractionByUserAndGroup = (user: User, group: Group) => {
    return this.interactionRepository.findOne({
      where: {
        user_to: {
          id : user.id
        },
        group_from: {
          id: group.id
        }
      }
    });
  }

}
