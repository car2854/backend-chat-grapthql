import { ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloDriver } from '@nestjs/apollo/dist/drivers';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ControllersModule } from './controllers/controllers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './entity/user.entity';
import { Interaction } from './entity/interaction.entity';
import { Chat } from './entity/chat.entity';
import { Group } from './entity/group.entity';
import { Image } from './entity/image.entity';

import { MulterModule } from "@nestjs/platform-express";
import { EventsGateway } from './events/events.gateway';

@Module({
  imports: [
    MulterModule.register({
      
    }),
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      username: 'postgres',
      password: 'password',
      database: 'chat',
      port: 5432,
      host: 'localhost',
      autoLoadEntities: true,
      synchronize: true,
      entities: [
        User, 
        Interaction,
        Chat,
        Group,
        Image
      ]
    }),
    ControllersModule
  ],
  controllers: [],
  providers: [EventsGateway],
})
export class AppModule {}
