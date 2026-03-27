import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from 'src/db/repository/user.repository';
import { UserModel } from 'src/db/models/user.model';
import { TokenService } from 'src/common';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UserModel],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, TokenService, JwtService],
})
export class AuthModule {}
