import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ){}

  findUserByEmail(email: string): Promise<User>{
    return this.userRepository.findOne({
      where: {
        email,
        is_active: true
      },
      relations:{
        image:true
      }
    });
  }

  findUserById(id:number): Promise<User>{
    return this.userRepository.findOne({
      where: {
        id, 
        is_active: true
      },
      relations:{
        image:true
      }
    })
  }

  createUser(userInput: CreateUserInput): Promise<User> {
    const userData = this.userRepository.create(userInput);
    return this.userRepository.save(userData);
  }

}
