import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsString } from 'class-validator';

export type UserDocument = User & Document;

@Schema()
export class User {
  @IsString()
  id: string;

  @Prop({ required: true })
  @IsString()
  name: string;

  @Prop({ required: true })
  @IsString()
  email: string;

  @Prop({ required: true })
  @IsString()
  image: string;

  @Prop({ required: true })
  @IsString()
  username: string;

  @Prop({ select: false })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
