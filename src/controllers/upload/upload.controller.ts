import { Controller, FileTypeValidator, ForbiddenException, HttpStatus, ParseFilePipe, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { RequestContextUid } from 'src/decorators/custom-header/custom-header.decorator';
import { AuthGuard } from 'src/guard/auth.guard';
import { UploadService } from './upload.service';
import { NotFoundException } from '@nestjs/common';
import { Body, Put, UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';

import { v2 as cloudinary } from 'cloudinary'

import fs from "fs";
import { diskStorage } from 'multer';
import { RoleUserInteraction } from 'src/enum/role-user-interaction';

@Controller('upload')
export class UploadController {

  constructor(
    private uploadService: UploadService
  ){
    cloudinary.config(process.env.CLOUDINARY_URL);
  }
  
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      filename(req, file, callback) {
        callback(null, Date.now() + file.originalname)
      },
    })
  }))
  @Put('/user')
  async uploadImageUser(
    @Res() res: Response, 
    @RequestContextUid() uid: number, 
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator(
            {
              fileType: '.(png|jpeg|jpg)'
              // fileType: 'png'
            },
          ),
        ]
      })
    ) image: Express.Multer.File,
  ){
    
    const user = await this.uploadService.findUserById(uid);
    if (!user) throw new NotFoundException('Usted no esta registrado');
    
    const resp = await cloudinary.uploader.upload(image.path, {
      folder: 'chat/profile-user',
    });
    
    let imageData = user.image;
    if (!imageData){

      imageData = await this.uploadService.createImage({
        dir: resp.secure_url,
        name: resp.public_id,
        user: user
      });

    }else{

      await Promise.all([
        cloudinary.uploader.destroy(imageData.name),

        this.uploadService.updateImage(imageData.id, {
          created_at: new Date(Date.now()),
          dir: resp.secure_url,
          name: resp.public_id,
        })
      ]);

      imageData.created_at = new Date(Date.now());
      imageData.dir = resp.secure_url;
      imageData.name = resp.public_id;

    }

    return res.status(HttpStatus.OK).json({
      'image': imageData
    });

  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      filename(req, file, callback) {
        callback(null, Date.now() + file.originalname)
      },
    })
  }))
  @Put('/group')
  async UploadImageGroup(
    @Res() res: Response, 
    @RequestContextUid() uid: number,
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator(
            {
              fileType: '.(png|jpeg|jpg)'
              // fileType: 'png'
            },
          ),
        ]
      })
    ) image: Express.Multer.File,
  ){
    
    const user = await this.uploadService.findUserById(uid);
    if (!user) throw new NotFoundException('Usted no esta registrado');

    const {idGroup} = req.body;

    const group = await this.uploadService.findGroupById(idGroup);
    if (!group) throw new NotFoundException('No existe este grupo');
    
    const interaction = await this.uploadService.findInteractionByUserGroup(user, group);
    if (!interaction) throw new NotFoundException('Usted no pertenece a este grupo');

    if (!(interaction.role === RoleUserInteraction.host || interaction.role === RoleUserInteraction.moderator)) throw new ForbiddenException('Usted no es un moderador o host de este grupo');

    const resp = await cloudinary.uploader.upload(image.path, {
      folder: 'chat/profile-group',
    });

    let imageData = group.image;
    if (!group.image){

      imageData = await this.uploadService.createImage({
        dir: resp.secure_url,
        name: resp.public_id,
        group: group
      });

    }else{

      await Promise.all([
        cloudinary.uploader.destroy(imageData.name),

        this.uploadService.updateImage(imageData.id, {
          created_at: new Date(Date.now()),
          dir: resp.secure_url,
          name: resp.public_id,
        })
      ]);

      imageData.created_at = new Date(Date.now());
      imageData.dir = resp.secure_url;
      imageData.name = resp.public_id;

    }

    return res.status(HttpStatus.OK).json({
      'image': imageData
    });

  }

}
