import { IsEmail, IsString, MinLength } from 'class-validator';

export class createAuthDto {
  @IsEmail()
  email: string;

  @MinLength(6, {
    message: 'At least 6 symbols',
  })
  @IsString()
  password: string;

  @IsString()
  name: string;
}
