import { IsString } from 'class-validator';

export class commentDto {
  @IsString()
  text: string;

  @IsString()
  senderId: string;

  @IsString()
  postId: string;
}
