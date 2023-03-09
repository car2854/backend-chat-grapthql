import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { InteractionModule } from './interaction/interaction.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { StatusModule } from './status/status.module';
import { GroupModule } from './group/group.module';

@Module({
  imports: [
    UserModule, 
    InteractionModule, 
    ChatModule, 
    AuthModule, StatusModule, GroupModule
  ]
})
export class ControllersModule {}
