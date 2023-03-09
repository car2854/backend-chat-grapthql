import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupResolver } from './group.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from 'src/entity/group.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/entity/user.entity';
import { Interaction } from 'src/entity/interaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, User, Interaction]),
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    JwtModule.register({
      secret: process.env.JWT,
      signOptions: {expiresIn: '7d'},
    }),
  ],
  providers: [GroupService, GroupResolver]
})
export class GroupModule {}
