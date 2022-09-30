import { PickType } from '@nestjs/mapped-types';
import { UserVo } from '../vo/user.vo';

export class LoginDto extends PickType(UserVo, ['email', 'password']) {}
