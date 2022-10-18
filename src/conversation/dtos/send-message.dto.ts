import { IsNumber, IsString } from 'class-validator';

export class sendMessageDto {
  @IsNumber()
  conversationId: number;
  @IsNumber()
  profileId: number;
  @IsString()
  text: string;
  @IsNumber()
  messageId?: number;
}
