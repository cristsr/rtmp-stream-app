import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddStreamCommand } from '../commands/add-stream.command';
import { Inject } from '@nestjs/common';
import { ONLINE_STREAMS } from '../constants';
import { StreamReq } from '../dto';

@CommandHandler(AddStreamCommand)
export class AddStreamHandler implements ICommandHandler<AddStreamCommand> {
  constructor(
    @Inject(ONLINE_STREAMS)
    private onlineStreams: Map<string, StreamReq>,
  ) {}

  async execute(command: AddStreamCommand): Promise<void> {
    this.onlineStreams.set(command.id, command);
  }
}
