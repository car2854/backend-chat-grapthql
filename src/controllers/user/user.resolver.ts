import { BadRequestException, HttpException, HttpStatus, NotFoundException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { Interaction } from 'src/entity/interaction.entity';
import { User } from 'src/entity/user.entity';
import { RoleUserInteraction } from 'src/enum/role-user-interaction';
import { AuthGuard } from 'src/guard/auth.guard';
import { CreateUserInput } from './dto/create-user.input';
import { UserService } from './user.service';

import { v4 as uuidv4 } from 'uuid';

@Resolver()
export class UserResolver {

  constructor(
    private userService: UserService,
  ){}

  @Query((returns) => [User])
  users(){
    return this.userService.findAllUser();
  }
  
  @Query((returns) => User)
  async user(
    @Args('id', {type: () => Int!}) id:number
  ){
    const user = await this.userService.findUserById(id);

    if (!user) throw new NotFoundException('No existe este usuario');
    
    return user;
  }

  @UseGuards(AuthGuard)
  @Mutation((returns) => User)
  async deleteUser(
    @Args('id', {type: () => Int!}) id:number,
    @Context('uid') uid:number
  ){

    if (uid != id){
      throw new UnauthorizedException('Usted no es este usuaro');
    }
    const user = await this.userService.findUserById(id);

    if (!user) throw new NotFoundException('No existe este usuario');
    
    user.is_active = false;
    await this.userService.deleteUser(id);
    return user;
  }

  @UseGuards(AuthGuard)
  @Mutation((returns) => User)
  async updateUidProfile(
    @Context('uid') uid: number
  ){

    const user = await this.userService.findUserById(uid);

    if (!user) throw new NotFoundException('Usted no esta registrado');

    user.uid_profile = uuidv4();

    await this.userService.updateUser(user.id, {uid_profile: user.uid_profile});

    return user;

  }

  @UseGuards(AuthGuard)
  @Mutation((returns) => User)
  async updateStatusUser(
    @Context('uid') uid:number,
    @Args('status', {type: () => String!}) status:string
  ){

    const user = await this.userService.findUserById(uid);
    if (!user) throw new NotFoundException('Usted no esta registrado');


    user.status = status;
    const result = await this.userService.updateUser(user.id, {status: status});
    console.log(result);
    
    return user;

  }

  @UseGuards(AuthGuard)
  @Mutation((returns) => User)
  async updateIdSection(
    @Context('uid') uid:number,
    @Args('idSection', {type: () => String!}) idSection: string
  ){

    const user = await this.userService.findUserById(uid);
    if (!user) throw new NotFoundException('Usted no esta registrado');
    user.id_section = idSection;
    await this.userService.updateUser(user.id, {id_section: idSection});
    return user;

  }
 
}
