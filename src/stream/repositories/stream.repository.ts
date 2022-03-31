import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Stream, StreamDocument } from '../schemas/stream.schema';
import { Model } from 'mongoose';
import { classToPlain } from 'class-transformer';

@Injectable()
export class StreamRepository {
  private logger = new Logger(StreamRepository.name);

  constructor(
    @InjectModel(Stream.name)
    private streamModel: Model<StreamDocument>,
  ) {}

  async findByKey(key: string): Promise<Record<any, any>> {
    const stream = await this.streamModel
      .findOne({ key })
      .populate('user')
      .exec();

    if (!stream) {
      return null;
    }

    return classToPlain(
      stream.toJSON({
        virtuals: true,
        transform: (doc, ret) => {
          ret.id = ret._id.toString();
          return ret;
        },
      }),
      {
        excludePrefixes: ['_'],
      },
    );
  }
}
