import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { mapEnvironmentKeys } from 'src/environment/utils';

export class Environment {
  @IsString()
  ENV: string = null;

  @IsString()
  DB_URI: string = null;

  @Transform(({ value }) => +value)
  @IsNumber()
  RTMP_PORT: number = null;

  @Transform(({ value }) => +value)
  @IsNumber()
  RTMP_CHUNK_SIZE: number = null;

  @Transform(({ value }) => +value)
  @IsNumber()
  HTTP_PORT: number = null;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  ENABLE_HLS: boolean = null;

  @Transform(({ value }) => +value)
  @IsNumber()
  MEDIA_SERVER_LOG_LEVEL: number = null;
}

export const ENV = mapEnvironmentKeys<Environment>(Environment);
