import { IsString, IsEmail, IsNumber, IsDate } from 'class-validator';

export class PostVo {
  @IsNumber()
  id: number;

  @IsString()
  code: string;

  @IsString()
  title: string;

  @IsString()
  contents: string;

  @IsString()
  fk_user_code: string;

  @IsDate()
  created_time: Date;

  @IsDate()
  updated_time: Date;
}
