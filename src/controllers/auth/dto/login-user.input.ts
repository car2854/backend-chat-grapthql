import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

@InputType()
export class LoginUserInput{

  @IsEmail()
  @Field()
  email: string;
  
  @IsNotEmpty()
  @MinLength(8)
  @Field()
  password: string;
  
}