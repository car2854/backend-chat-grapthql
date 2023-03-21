import { Field, InputType } from "@nestjs/graphql";
import { FileUpload } from './file-upload';
import { IsNotEmpty } from 'class-validator';

// import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

@InputType()
export class UploadImageUserInput{

  @IsNotEmpty()
  // @Field((type) => GraphQLUpload)
  image: Promise<FileUpload>;

}