import { IsString } from 'class-validator';

export class StreamReq {
  @IsString()
  id: string;

  @IsString()
  key: string;
}
