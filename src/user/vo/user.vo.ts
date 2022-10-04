import { IsString, IsEmail, IsNumber } from 'class-validator';

export class UserVo {
  @IsString()
  code: string;

  @IsString()
  login_type: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsNumber()
  role: number;
}
