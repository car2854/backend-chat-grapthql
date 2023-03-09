import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Group } from 'src/entity/group.entity';
import { User } from 'src/entity/user.entity';
import { AuthGuard } from 'src/guard/auth.guard';
import { NewGroupInput } from './dto/new-group.input';
import { UserInput } from './dto/user.input';
import { GroupService } from './group.service';

@Resolver()
export class GroupResolver {

  constructor(
    private groupService: GroupService
  ){}

  @UseGuards(AuthGuard)
  @Mutation((returns) => Group)
  async createGroup(
    @Context('uid') uid:number,
    @Args('newGroupInput') newGroupInput: NewGroupInput
  ){

    const userUid = await this.groupService.findUserById(uid);
    if (!userUid) throw new NotFoundException('Usted no esta registrado');

    const users = await Promise.all(
      newGroupInput.users.map((user:UserInput) => this.groupService.findUserById(user.id))
    );

    if (users.includes(null)) throw new NotFoundException('Hay usuarios que no existen');
    
    const group = await this.groupService.createGroup({title: newGroupInput.title, description: newGroupInput.description});

    await Promise.all([
      users.map((user: User) => this.groupService.createInteraction({group_from: group, user_to: user})),
      this.groupService.createInteraction({group_from: group, user_to: userUid})
    ]);

    return group;

  }

}
