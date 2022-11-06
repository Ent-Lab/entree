import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Post } from '../vo/post.vo';

export class CreatePostDto extends Post {
  @ApiProperty({ description: 'Post contents', example: '게시물 내용입니다. ' })
  @IsString()
  contents: string;

  @ApiProperty({ description: 'Post title', example: '게시물 제목입니다. ' })
  @IsString()
  title: string;
  @ApiProperty({
    description: '유저 id입니다. ',
  })
  fk_user_id: number;

  @ApiProperty({
    description: 'Post thumbnail',
    example: '게시물 썸네일입니다. ',
  })
  thumbnail: string;

  @ApiProperty({ description: 'Post summary', example: '게시물 요약입니다. ' })
  summary: string;
}
