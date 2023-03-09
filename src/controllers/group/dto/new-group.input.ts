import { Field, InputType, Int } from "@nestjs/graphql";
import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";
import { User } from "src/entity/user.entity";
import { UserInput } from "./user.input";

@InputType()
export class NewGroupInput{

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Field((type) => String)
  title: string;

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Field((type) => String, {nullable: true})
  description?: string;
  
  @IsNotEmpty()
  @Field(type => [UserInput])
  users: UserInput[];

}