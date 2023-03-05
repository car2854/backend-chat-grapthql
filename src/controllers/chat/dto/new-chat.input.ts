import { Field, InputType, Int } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { TransformFnParams } from "class-transformer/types/interfaces";
import { IsNotEmpty, IsNumber } from "class-validator";

@InputType()
export class NewChatInput{

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Field((type) => String)
  message:string;
  
  @IsNotEmpty()
  @IsNumber()
  @Field((type) => Int)
  userTo:number;
  
}