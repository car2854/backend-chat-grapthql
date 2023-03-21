import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/entity/chat.entity';
import { Group } from 'src/entity/group.entity';
import { Image } from 'src/entity/image.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UploadService {

  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,

    @InjectRepository(User)
    private userRepository: Repository<User>
  ){}

  public updateImage = (id: number, data:{name: string, dir: string, created_at: Date}) => {
    return this.imageRepository.update(id, data);
  }

  public createImage = (data:{
    name: string, dir: string, user?: User, chat?: Chat, group?: Group
  }) => {
    const imageData = this.imageRepository.create(data);
    return this.imageRepository.save(imageData);
  }

  public findImageById = (id:number) => {
    return this.imageRepository.findOne({
      where: {
        id
      }
    });
  }

  

  public findUserById = (id:number) => {
    return this.userRepository.findOne({
      where: {
        id
      },
      relations: {
        image: true
      }
    })
  }

}