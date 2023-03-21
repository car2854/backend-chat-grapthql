import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { Image } from 'src/entity/image.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt'
import { UploadController } from './upload.controller';
import { User } from 'src/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Image, User]),
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    JwtModule.register({
      secret: process.env.JWT,
      signOptions: {expiresIn: '7d'},
    }),
  ],

  providers: [UploadService],

  controllers: [UploadController]
})
export class UploadModule {}
