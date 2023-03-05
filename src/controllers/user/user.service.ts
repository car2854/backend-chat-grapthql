import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
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
}
