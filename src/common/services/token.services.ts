import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken = (payload: object, options: JwtSignOptions) => {
    return this.jwtService.sign(payload, options);
  };

  verifyToken = (token: string, options: JwtVerifyOptions) => {
    try {
      return this.jwtService.verify(token, options);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      } else if (err.name === 'JsonWebTokenError' || err.name === 'NotBeforeError') {
        throw new UnauthorizedException('Invalid token');
      } else {
        throw new UnauthorizedException('Authentication failed');
      }
    }
  };
}
