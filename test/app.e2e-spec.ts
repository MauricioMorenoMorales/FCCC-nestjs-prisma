import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dtos';

describe('App e2e', () => {
  let app: INestApplication;
  beforeAll(async () => {
    let prisma: PrismaService;

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();
    await app.listen(3333);
    prisma = app.get(PrismaService);
    await prisma.cleanDb();

    pactum.request.setBaseUrl('http://localhost:3333');
  });
  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = { email: 'vlad@gmail.com', password: '123' };
    describe('Signup', () => {
      it('Should throw error if the email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto.password)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('Should throw error if the password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto.email)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('Should throw an error if there is no Dto', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('Should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(HttpStatus.CREATED);
      });
    });

    describe('Signin', () => {
      it('Should throw error if the email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto.password)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('Should throw error if the password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto.email)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('Should throw an error if there is no Dto', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({})
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('Should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(HttpStatus.ACCEPTED)
          .stores('userAt', 'access_token');
      });
    });
  });
  describe('User', () => {
    describe('Get me', () => {});
    describe('Edit user', () => {});
  });
  describe('Bookmarks', () => {
    describe('Create Bookmarks', () => {});
    describe('Get Bookmarks', () => {});
    describe('Get bookmark by id', () => {});
    describe('Edit bookmark', () => {});
    describe('Delete bookmark', () => {});
  });
});
