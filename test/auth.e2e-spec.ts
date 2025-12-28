import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const email = 'test33@gmail.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: email,
        password: 'test3',
      })
      .expect(201)
      .then((res) => {
        const { id, email: responseEmail } = res.body;
        expect(id).toBeDefined();
        expect(responseEmail).toEqual(email);
      });
  });
});
