import { IsString } from 'class-validator';

export class createPostDto {
  @IsString()
  text: string;

  @IsString()
  senderId: string;
}
