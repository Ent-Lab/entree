import { PartialType } from '@nestjs/mapped-types';
import { UserVo } from '../vo/user.vo';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(UserVo) {}
