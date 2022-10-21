import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNumber, IsDate } from 'class-validator';

export class UserVo {
  @ApiProperty({ description: 'User id', example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'User Image url', example: 'asdsafs123134' })
  @IsString()
  image_url: string;

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

  @ApiProperty({
    description: 'User created time',
    example: '2022-10-08T21:10:59.000Z',
  })
  @IsDate()
  created_time: Date;

  @ApiProperty({
    description: 'User updated time',
    example: '2022-10-08T21:10:59.000Z',
  })
  @IsDate()
  updated_time: Date;
}
