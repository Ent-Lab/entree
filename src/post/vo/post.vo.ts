import { IsString, IsEmail, IsNumber, IsDate } from 'class-validator';

export class Post {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  contents: string;

  fk_user_id: number;

  @IsString()
  summary: string;

  @IsString()
  thumbnail: string;

  @IsDate()
  created_time: Date;

  @IsDate()
  updated_time: Date;
}
