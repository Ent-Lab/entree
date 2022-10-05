import { PickType } from '@nestjs/mapped-types';
import { PostVo } from '../vo/post.vo';

export class GetPostDto extends PickType(PostVo, [
  'code',
  'contents',
  'fk_user_code',
  'title',
  'created_time',
  'updated_time',
]) {}
