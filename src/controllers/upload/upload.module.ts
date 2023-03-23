import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { Image } from 'src/entity/image.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt'
import { UploadController } from './upload.controller';
import { User } from 'src/entity/user.entity';
import { Group } from 'src/entity/group.entity';
import { Interaction } from 'src/entity/interaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Image, User, Group, Interaction]),
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
