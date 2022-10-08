// roles.guard.ts

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/custom.decorator';
import { UserService } from 'src/user/user.service';
import { Role } from '../roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { headers } = context.switchToHttp().getRequest();

    if (headers.authorization?.startsWith('Bearer ')) {
      const token = headers.authorization.substring(7);
      const verified = await this.userService.verifyToken(token);
      const user = await this.userService.findOne(verified.id);

      return requiredRoles.some((role) => user.role?.includes(role));
    }

    return null;
  }
}
