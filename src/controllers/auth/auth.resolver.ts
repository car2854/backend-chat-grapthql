import { Args, Query, Resolver, Mutation, Int, Context } from '@nestjs/graphql';
import { User } from 'src/entity/user.entity';
import { AuthService } from './auth.service';
import { UnauthorizedException, BadRequestException, UseGuards } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { CreateUserInput } from './dto/create-user.input';

import * as bcrypt from 'bcrypt';
import { LoginUserInput } from './dto/login-user.input';
import { AuthGuard } from 'src/guard/auth.guard';

import { v4 as uuidv4 } from 'uuid';

@Resolver()
export class AuthResolver {

  constructor(
    private authService: AuthService,
    private jwtService: JwtService
  ){}

  @Mutation((returns) => User)
  async login(
    @Args('loginUserInput') loginUserInput: LoginUserInput
  ){
    const user = await this.authService.findUserByEmail(loginUserInput.email);
    if (!user) throw new UnauthorizedException('Datos incorrectos');

    const statusPass = bcrypt.compareSync(loginUserInput.password, user.password);
    if (!statusPass) throw new UnauthorizedException('Datos incorrectos');

    user.token = this.jwtService.sign({ id: user.id });
    return user;
  }

  @Mutation((returns) => User)
  async register(
    @Args('userInput') userInput: CreateUserInput,
  ){
    const userDB = await this.authService.findUserByEmail(userInput.email);
    if (userDB) throw new BadRequestException('Este email ya esta siendo utilizado');
    
    const salt = await bcrypt.genSalt();
    userInput.password = await bcrypt.hash(userInput.password, salt);
    userInput.uid_profile = uuidv4();
    const user = await this.authService.createUser(userInput);
    user.token = this.jwtService.sign({ id: user.id });
    return user;
  }

  @UseGuards(AuthGuard)
  @Mutation((returns) => User)
  async renewToken(
    @Context('uid') uid:number
  ){
    const user = await this.authService.findUserById(uid);
    if (!user) throw new Error('Usted no esta registrado');
    user.token = this.jwtService.sign({ id: user.id });
    return user;
  }

}
