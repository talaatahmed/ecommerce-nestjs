import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, RolesGuard } from 'src/common';

//param decorator
export const AuthUser = createParamDecorator((data, cxt: ExecutionContext) => {
  const req = cxt.switchToHttp().getRequest();
  return req.loggedInUser.user;
});

//custom decorator
export const Roles = (roles: string[]) => SetMetadata('roles', roles);

export function Auth(roles: string[]) {
  return applyDecorators(UseGuards(AuthGuard, RolesGuard), Roles(roles));
}
