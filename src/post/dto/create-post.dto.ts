import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { PostVo } from '../vo/post.vo';

export class CreatePostDto extends PickType(PostVo, ['contents', 'title']) {
  @ApiProperty({ description: 'Post contents', example: '게시물 내용입니다. ' })
  @IsString()
  contents: string;

  @ApiProperty({ description: 'Post title', example: '게시물 제목입니다. ' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'User id', example: 1 })
  @IsNumber()
  fk_user_id: number;
}
