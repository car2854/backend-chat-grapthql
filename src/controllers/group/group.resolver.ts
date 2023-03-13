import { BadRequestException, ForbiddenException, Logger, NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Resolver, Query } from '@nestjs/graphql';
import { Group } from 'src/entity/group.entity';
import { Interaction } from 'src/entity/interaction.entity';
import { User } from 'src/entity/user.entity';
import { RoleUserInteraction } from 'src/enum/role-user-interaction';
import { StatusInteractionEnum } from 'src/enum/status-interaction';
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

  @UseGuards(AuthGuard)
  @Mutation((returns) => Interaction)
  async newModerator(
    @Context('uid') uid:number,
    @Args('id', {type: () => Int!}) id:number
  ){

    const user = await this.groupService.findUserById(uid);
    if (!user) throw new NotFoundException('Usted no esta registrado');

    const interaction = await this.groupService.findInteractionById(id);
    if (!interaction) throw new NotFoundException('No existe esta interaccion entre el usuario y el grupo');

    const interactionUser = await this.groupService.findInteractionByUserGroup(user, interaction.group_from);
    if (!interactionUser) throw new NotFoundException('No existe esta interaccion entre usted y el grupo');
    
    if (!(interactionUser.role === RoleUserInteraction.host || interactionUser.role === RoleUserInteraction.moderator)) throw new ForbiddenException('Usted no es un moderador o host de este grupo');

    interaction.role = RoleUserInteraction.moderator;
    await this.groupService.updateInteraction(interaction.id, {role: interaction.role});

    return interaction;
  }

  @UseGuards(AuthGuard)
  @Mutation((returns) => Interaction)
  async clearRole(
    @Context('uid') uid:number,
    @Args('id', {type: () => Int!}) id:number
  ){

    const user = await this.groupService.findUserById(uid);
    if (!user) throw new NotFoundException('Usted no esta registrado');

    const interaction = await this.groupService.findInteractionById(id);
    if (!interaction) throw new NotFoundException('No existe esta interaccion entre el usuario y el grupo');

    const interactionUser = await this.groupService.findInteractionByUserGroup(user, interaction.group_from);
    if (!interactionUser) throw new NotFoundException('No existe esta interaccion entre usted y el grupo');
    
    if (!(interactionUser.role === RoleUserInteraction.host || interactionUser.role === RoleUserInteraction.moderator)) throw new ForbiddenException('Usted no es un moderador o host de este grupo');

    interaction.role = RoleUserInteraction.none;
    await this.groupService.updateInteraction(interaction.id, {role: interaction.role});

    return interaction;
  }
}
