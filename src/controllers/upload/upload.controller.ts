import { Controller, FileTypeValidator, HttpStatus, ParseFilePipe, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { RequestContextUid } from 'src/decorators/custom-header/custom-header.decorator';
import { AuthGuard } from 'src/guard/auth.guard';
import { UploadService } from './upload.service';
import { NotFoundException } from '@nestjs/common';
import { Body, Put, UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';

import { v2 as cloudinary } from 'cloudinary'

import fs from "fs";
import { diskStorage } from 'multer';

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

}
