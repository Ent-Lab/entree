import { PickType } from '@nestjs/mapped-types';
import { IsEmail, IsString } from 'class-validator';
import { UserVo } from '../vo/user.vo';

export class CreateUserDto extends PickType(UserVo, [
  'login_type',
  'email',
  'password',
  'role',
]) {
  @IsString()
  login_type: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  role: string;
}
