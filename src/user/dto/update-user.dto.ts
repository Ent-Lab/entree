import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';
import { UserVo } from '../vo/user.vo';

export class UpdateUserDto extends UserVo {
  @ApiProperty({ description: 'User login type', example: 'local' })
  @IsString()
  login_type: string;

  @ApiProperty({ description: 'User email', example: 'test1234@naver.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password', example: 'asdf1234!!' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'User role', example: 'user' })
  @IsString()
  role: string;
}
