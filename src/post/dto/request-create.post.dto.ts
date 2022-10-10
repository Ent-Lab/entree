import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { PostVo } from '../vo/post.vo';

export class RequestCreatePostDto extends PostVo {
  @ApiProperty({ description: 'Post contents', example: '게시물 내용입니다. ' })
  @IsString()
  contents: string;

  @ApiProperty({ description: 'Post title', example: '게시물 제목입니다. ' })
  @IsString()
  title: string;
}
