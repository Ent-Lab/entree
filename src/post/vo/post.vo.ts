import { IsString, IsEmail, IsNumber, IsDate } from 'class-validator';

export class PostVo {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  contents: string;

  fk_user_id: number;

  @IsDate()
  created_time: Date;

  @IsDate()
  updated_time: Date;
}
