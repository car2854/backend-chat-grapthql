import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { Args, Context, Int, Mutation, Resolver } from '@nestjs/graphql';
import { AuthGuard } from 'src/guard/auth.guard';
import { StatusService } from './status.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Interaction } from 'src/entity/interaction.entity';

@Resolver()
export class StatusResolver {

  constructor(
    private statusService: StatusService
  ){}
  
  @UseGuards(AuthGuard)
  @Mutation((returns) => Interaction)
  async lockedUser(
    @Context('uid') uid:number,
    @Args('id', {type: () => Int}) id:number
  ){

    if (uid === id) throw new BadRequestException('Debe seleccionar otro usuario que no sea usted mismo')

    const [userUid, user] = await Promise.all([
      this.statusService.findUserById(uid),
      this.statusService.findUserById(id)
    ]);

    if (!userUid) throw new NotFoundException('Usted no esta registrado');
    if (!user) throw new NotFoundException('No existe el Usuario al que intenta comunicarse')

    const interaction = await this.statusService.findInteractionByUsers(userUid, user);
    
    if (interaction.user_from.id === userUid.id){
      interaction.status_to = 'locked';
    }else if (interaction.user_to.id === userUid.id){
      interaction.status_from = 'locked';
    }

    await this.statusService.updateInteraction(interaction.id, {status_from: interaction.status_from, status_to: interaction.status_to});

    return interaction;
    
  }

  @UseGuards(AuthGuard)
  @Mutation((returns) => Interaction)
  async clearStatusUser(
    @Context('uid') uid:number,
    @Args('id', {type: () => Int}) id:number
  ){
    if (uid === id) throw new BadRequestException('Debe seleccionar otro usuario que no sea usted mismo')

    const [userUid, user] = await Promise.all([
      this.statusService.findUserById(uid),
      this.statusService.findUserById(id)
    ]);

    if (!userUid) throw new NotFoundException('Usted no esta registrado');
    if (!user) throw new NotFoundException('No existe el Usuario al que intenta comunicarse')

    const interaction = await this.statusService.findInteractionByUsers(userUid, user);
    
    if (interaction.user_from.id === userUid.id){
      interaction.status_to = 'active';
    }else if (interaction.user_to.id === userUid.id){
      interaction.status_from = 'active';
    }

    await this.statusService.updateInteraction(interaction.id, {status_from: interaction.status_from, status_to: interaction.status_to});

    return interaction;
  }

  @UseGuards(AuthGuard)
  @Mutation((returns) => Interaction)
  async silencedUser(
    @Context('uid') uid:number,
    @Args('id', {type: () => Int}) id:number
  ){
    if (uid === id) throw new BadRequestException('Debe seleccionar otro usuario que no sea usted mismo')

    const [userUid, user] = await Promise.all([
      this.statusService.findUserById(uid),
      this.statusService.findUserById(id)
    ]);

    if (!userUid) throw new NotFoundException('Usted no esta registrado');
    if (!user) throw new NotFoundException('No existe el Usuario al que intenta comunicarse')

    const interaction = await this.statusService.findInteractionByUsers(userUid, user);
    
    if (interaction.user_from.id === userUid.id){
      interaction.status_to = 'silenced';
    }else if (interaction.user_to.id === userUid.id){
      interaction.status_from = 'silenced';
    }

    await this.statusService.updateInteraction(interaction.id, {status_from: interaction.status_from, status_to: interaction.status_to});

    return interaction;
  }

}
