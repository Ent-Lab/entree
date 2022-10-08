import { IsString, IsEmail, IsNumber, IsDate } from 'class-validator';

export class UserVo {
  @IsNumber()
  id: number;

  @IsString()
  code: string;

  @IsString()
  login_type: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  role: string;

  @IsDate()
  created_time: Date;

  @IsDate()
  updated_time: Date;
}
