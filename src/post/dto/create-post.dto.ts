import { PickType } from '@nestjs/mapped-types';
import { PostVo } from '../vo/post.vo';

export class CreatePostDto extends PickType(PostVo, [
  'code',
  'contents',
  'fk_user_code',
  'title',
]) {}
