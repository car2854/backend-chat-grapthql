import { Field, InputType, Int } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { TransformFnParams } from "class-transformer/types/interfaces";
import { IsNotEmpty } from "class-validator";

@InputType()
export class NewChatGroupInput{

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Field((type) => String!)
  message:string;
  
  @IsNotEmpty()
  @Field((type) => String!)
  groupTo:string;
  
}