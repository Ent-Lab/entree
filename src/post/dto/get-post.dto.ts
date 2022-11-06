import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { Post } from '../vo/post.vo';

export class GetPostDto extends Post {
  @ApiProperty({ description: 'Post id', example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'User id', example: 1 })
  @IsNumber()
  fk_user_id: number;

  @ApiProperty({ description: 'Post title', example: '게시물 제목입니다. ' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Post contents', example: '게시물 내용입니다. ' })
  @IsString()
  contents: string;

  @ApiProperty({
    description: 'Post thumbnail',
    example: '게시물 썸네일입니다. ',
  })
  thumbnail: string;

  @ApiProperty({ description: 'Post summary', example: '게시물 요약입니다. ' })
  summary: string;

  @ApiProperty({
    description: 'Post created time',
    example: '2022-10-10T16:52:51.000Z',
  })
  @IsDate()
  created_time: Date;

  @ApiProperty({
    description: 'Post updated time',
    example: '2022-10-10T16:52:51.000Z',
  })
  @IsDate()
  updated_time: Date;
}
