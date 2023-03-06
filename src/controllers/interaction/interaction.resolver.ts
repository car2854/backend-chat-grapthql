import { BadRequestException, NotFoundException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Context, Int, Query, Resolver } from '@nestjs/graphql';
import { Interaction } from 'src/entity/interaction.entity';
import { User } from 'src/entity/user.entity';
import { AuthGuard } from 'src/guard/auth.guard';
import { InteractionService } from './interaction.service';

@Resolver()
export class InteractionResolver {
  constructor(
    private interactionService: InteractionService
  ){}

  @Query((returns) => [Interaction])
  interactions(){
    return this.interactionService.findAllInteraction()
  }

  @UseGuards(AuthGuard)
  @Query((returns) => Interaction)
  async findUserInteraction(
    @Context('uid') uid:number,
    @Args('id', {type: () => Int}) id:number,
  ){
    
    if (uid === id) throw new BadRequestException('Debe seleccionar otro usuario que no sea usted mismo')

    const [userUid, user] = await Promise.all([
      this.interactionService.findUserById(uid),
      this.interactionService.findUserById(id)
    ]);

    if (!userUid) throw new NotFoundException('Usted no esta registrado');
    if (!user) throw new NotFoundException('No existe el Usuario al que intenta comunicarse')

    
    let interaction = await this.interactionService.findInteractionByUsers(userUid, user);
    
    if (!interaction) interaction = await this.interactionService.createInteraction(userUid, user);
    
    return interaction;

  }

  @UseGuards(AuthGuard)
  @Query((returns) => [Interaction])
  async getUsersInteractions(
    @Context('uid') uid:number,
    @Args('userName', {nullable: true, type: () => String}) userName: string
  ){
    
    const user = await this.interactionService.findUserById(uid);
    if (!user) throw new NotFoundException('Usted no esta registrado');
    const interactions = await this.interactionService.findUserInteractionByUserAuth(user, userName);
    return interactions;
  }
}
