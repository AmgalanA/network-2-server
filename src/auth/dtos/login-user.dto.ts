import { IsEmail, IsString, MinLength } from 'class-validator';
import { createAuthDto } from './create-auth.dto';

export class loginUserDto {
  @IsEmail()
  email: string;

  @MinLength(6, {
    message: 'At least 6 symbols',
  })
  @IsString()
  password: string;
}
