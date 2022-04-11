import { Inject, Injectable, Logger } from '@nestjs/common';
import { MONGO_CLIENT } from 'stream/constants';
import { MongoClient } from 'mongodb';

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

      return {
        id: stream._id.toString(),
        user: stream.user.toString(),
        key: stream.key,
      };
    } catch (e) {
      this.logger.error(e);
      return null;
    } finally {
      await this.mongoClient.close();
    }
  }
}
