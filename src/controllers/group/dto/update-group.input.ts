import { Field, InputType, Int } from "@nestjs/graphql";
import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";

@InputType()
export class UpdateGroupInput{

  @IsNotEmpty()
  @Field((type) => String!)
  idGroup: string;
  
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Field((type) => String, {nullable: true})
  title: string;

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Field((type) => String, {nullable: true})
  description?: string;
  
  @IsOptional()
  @Field((type) => Boolean, {nullable: true})
  allow_image?: boolean;

  @IsOptional()
  @Field((type) => Boolean, {nullable: true})
  only_mod_host?: boolean;
  

}