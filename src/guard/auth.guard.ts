import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';

import { UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    const ctx = GqlExecutionContext.create(context).getContext();
    const token = ctx.req.headers.token;
    if (!token){
      throw new UnauthorizedException('No hay token en la peticion');
    }
    try {
      const data = this.jwtService.verify(token);
      ctx.uid = data.id;
    } catch (error) {
      throw new UnauthorizedException('Token invalido');
    }  
    return true;
  }
}
