import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsEmail, MinLength, IsOptional } from 'class-validator';

@InputType()
export class CreateUserInput{

  @IsNotEmpty()
  @Field()
  name: string;
  
  @IsEmail()
  @Field()
  email: string;
  
  @MinLength(8)
  @IsNotEmpty()
  @Field()
  password: string;

  @IsOptional()
  uid_profile: string;

}