import { BadRequestException, NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Resolver, Query } from '@nestjs/graphql';
import { Group } from 'src/entity/group.entity';
import { Interaction } from 'src/entity/interaction.entity';
import { User } from 'src/entity/user.entity';
import { RoleUserInteraction } from 'src/enum/role-user-interaction';
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
    if (users.includes(userUid)) throw new BadRequestException('No puede seleccionarte como usuario que se va a agregar a si mismo al grupo');

    const group = await this.groupService.createGroup({title: newGroupInput.title, description: newGroupInput.description});

    await Promise.all([
      users.map((user: User) => this.groupService.createInteraction({group_from: group, user_to: user})),
      this.groupService.createInteraction({group_from: group, user_to: userUid, role: RoleUserInteraction.host})
    ]);

    return group;

  }

  @UseGuards(AuthGuard)
  @Query((returns) => [Interaction])
  async getAllUsersWithinGroup(
    @Context('uid') uid:number,
    @Args('id', {type: () => String!}) id: string
  ){

    const user = await this.groupService.findUserById(uid);
    if (!user) throw new NotFoundException('Usted no esta registrado');
    const group = await this.groupService.findGroupById(id);
    if (!group) throw new NotFoundException('No existe este grupo');
    
    if (!group.interactions_from.some((interacion: Interaction) => interacion.user_to.id === user.id)) throw new BadRequestException('Usted no pertenece a este grupo');
    const interactions = await this.groupService.findAllInteractionsByGroup(group)

    return interactions;

  }
}
