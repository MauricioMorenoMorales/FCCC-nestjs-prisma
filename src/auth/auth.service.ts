import { Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  public signin() {
    return 'I am signin';
  }
  public signup() {
    return 'I am signup';
  }
}
