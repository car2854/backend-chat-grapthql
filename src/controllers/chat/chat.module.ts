import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from 'src/entity/chat.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/entity/user.entity';
import { Interaction } from 'src/entity/interaction.entity';
import { Group } from 'src/entity/group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, User, Interaction, Group]),
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    JwtModule.register({
      secret: process.env.JWT,
      signOptions: {expiresIn: '7d'},
    }),
  ],
  providers: [ChatService, ChatResolver]
})
export class ChatModule {}
