import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserType } from 'src/db/models/user.model';
import { UserRepository } from 'src/db/repository/user.repository';
import { TokenService, compareHash, encrypt, generateHash } from 'src/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private tokenService: TokenService,
  ) {}

  async register(body: object) {
    const { firstName, lastName, email, password, age, gender, phone, role }: Partial<UserType> = body;

    const isEmailAlreadyExist = await this.userRepository.findOneDocument({
      email,
    });

    if (isEmailAlreadyExist) throw new ConflictException('Email is already exist');

    const hashPassword = generateHash(password as string);
    const encryptedPhone = encrypt(phone as string);
    const user = await this.userRepository.createDocument({
      firstName,
      lastName,
      email,
      password: hashPassword,
      age,
      gender,
      phone: encryptedPhone,
      role,
    });

    return user;
  }

  async login(body: object) {
    const { email, password }: Partial<UserType> = body;

    const user = await this.userRepository.findOneDocument({ email });
    if (!user) throw new NotFoundException('email not found');

    const result = compareHash(password as string, user.password);
    if (!result) throw new UnauthorizedException('invalid password');

    const accessToken = this.tokenService.generateToken(
      { id: user._id },
      {
        secret: process.env.JWT_ACCESS_SECRET as string,
        expiresIn: '5d',
      },
    );
    return { accessToken };
  }

  //////////////////////////////////////Auto generated////////////////////////////////////
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
