import { IsString, IsEmail } from 'class-validator';

export class UserVo {
  @IsString()
  code: string;

  @IsString()
  login_type: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
