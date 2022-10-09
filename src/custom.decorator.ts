import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { GetUserDto } from './user/dto/get-user.dto';
import { SetMetadata } from '@nestjs/common';
import { Role } from './auth/roles.enum';

// @GetUser: Reqeust에서 user 가져오기
export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): GetUserDto => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  }
);

export const GetAdmin = createParamDecorator(
  (data, ctx: ExecutionContext): GetUserDto => {
    const req = ctx.switchToHttp().getRequest();
    if (req.user.role === 'admin') return req.user;
    else throw new UnauthorizedException('관리자만 접근 가능합니다.');
  }
);

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
