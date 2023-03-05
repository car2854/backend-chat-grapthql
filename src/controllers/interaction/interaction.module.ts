import { Module } from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { InteractionResolver } from './interaction.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interaction } from 'src/entity/interaction.entity';
import { User } from 'src/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Interaction, User]),
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    JwtModule.register({
      secret: process.env.JWT,
      signOptions: {expiresIn: '7d'},
    }),
  ],
  providers: [InteractionService, InteractionResolver]
})
export class InteractionModule {}
