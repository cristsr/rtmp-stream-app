class UserDto {}

export class StreamDto {
  id: string;
  title: string;
  description: string;
  streamUrl: string;
  thumbnail: string;
  user: UserDto;
}
