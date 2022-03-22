import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dtos';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  public async signup(dto: AuthDto) {
    // Generate the password
    const hash = await argon.hash(dto.password);
    try {
      //Save the new user in the db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hashedPassword: hash,
        },
      });
      delete user.hashedPassword;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        if (error.code === 'P2002')
          throw new ForbiddenException('The email is already taken');
      throw new BadRequestException('The data sended is invalid');
    }
  }

  public async signin(dto: AuthDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('Credentials incorrect');
    const passwordMatch = await argon.verify(user.hashedPassword, dto.password);
    if (!passwordMatch) throw new ForbiddenException('Credentials incorrect');
    return this.signToken(user.id, user.email);
  }

  public async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '10d',
      secret: this.config.get('JWT_SECRET'),
    });
    return { access_token };
  }
}
