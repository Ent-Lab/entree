import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { UserVo } from '../vo/user.vo';

export class LoginDto extends UserVo {
  @ApiProperty({ description: 'User email', example: 'test1234@naver.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password', example: 'asdf1234!!' })
  @IsString()
  password: string;
}
