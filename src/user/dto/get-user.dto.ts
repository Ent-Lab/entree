import { PickType } from '@nestjs/mapped-types';
import { UserVo } from '../vo/user.vo';

export class GetUserDto extends PickType(UserVo, [
  'id',
  'code',
  'login_type',
  'email',
  'password',
  'role',
  'created_time',
  'updated_time',
]) {}
