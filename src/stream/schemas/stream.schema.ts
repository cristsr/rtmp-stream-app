import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type StreamDocument = Stream & Document;

@Schema()
export class Stream {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: unknown;

  @Prop({ required: true })
  key: string;

  @Prop()
  id: string;
}

export const StreamSchema = SchemaFactory.createForClass(Stream);
