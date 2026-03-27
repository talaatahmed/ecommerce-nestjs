import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/common';
import { UserModel } from 'src/db/models';
import { UserRepository } from 'src/db/repository';

@Global()
@Module({
  imports: [UserModel],
  providers: [UserRepository, TokenService, JwtService],
  exports: [UserRepository, TokenService, JwtService],
})
export class GlobalModule {}
