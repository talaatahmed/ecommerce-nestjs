import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TokenService } from '../services';
import { UserRepository } from 'src/db/repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const {
      headers: { authorization },
    } = request;

    if (!authorization) throw new BadRequestException('Please Login...');

    const verifiedData = this.tokenService.verifyToken(authorization, {
      secret: process.env.JWT_ACCESS_SECRET as string,
    });

    const user = await this.userRepository.findOneDocument({ _id: verifiedData.id });
    if (!user) throw new BadRequestException('please signup');
    request.loggedInUser = { user, verifiedData };

    return true;
  }
}
