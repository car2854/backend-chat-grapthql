import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class UserInput{
  @IsNotEmpty()
  @Field((type) => Int)
  id: number;
  
  @IsNotEmpty()
  @Field((type) => String)
  name: string;
  
}