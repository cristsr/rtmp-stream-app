import { Inject, Injectable, Logger } from '@nestjs/common';
import { MONGO_CLIENT } from '../../constants';
import { MongoClient } from 'mongodb';
import { classToClass } from 'class-transformer';

@Injectable()
export class StreamRepository {
  private readonly logger = new Logger(StreamRepository.name);

  constructor(@Inject(MONGO_CLIENT) private mongoClient: MongoClient) {}

  async findByKey(key: string): Promise<Record<string, string>> {
    try {
      await this.mongoClient.connect();

      const database = this.mongoClient.db('stream-app');
      const streams = database.collection('streams');

      const stream = await streams.findOne({ key });

      if (!stream) {
        return null;
      }

      stream.id = stream._id;

      return classToClass(stream, { excludePrefixes: ['_'] });
    } catch (e) {
      this.logger.error(e);
      return null;
    } finally {
      await this.mongoClient.close();
    }
  }
}
