import { BadRequestException, HttpException, HttpStatus, NotFoundException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { Interaction } from 'src/entity/interaction.entity';
import { User } from 'src/entity/user.entity';
import { RoleUserInteraction } from 'src/enum/role-user-interaction';
import { AuthGuard } from 'src/guard/auth.guard';
import { CreateUserInput } from './dto/create-user.input';
import { UserService } from './user.service';

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

}
