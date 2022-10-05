import { PickType } from '@nestjs/mapped-types';
import { UserVo } from '../vo/user.vo';

export class CreateUserDto extends PickType(UserVo, [
  'code',
  'login_type',
  'email',
  'role',
]) {}
