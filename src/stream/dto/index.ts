import { IsString } from 'class-validator';

export class StreamReq {
  @IsString()
  key: string;

  @IsString()
  thumbnail: string;
}
