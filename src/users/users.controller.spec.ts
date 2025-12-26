import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        if (id === 1) {
          return Promise.resolve({ id: 1, email: 'test@example.com' } as User);
        }
        return Promise.resolve(null);
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email } as User]);
      },
      remove: (id: number) => {
        if (id === 1) {
          return Promise.resolve({ id: 1, email: 'test@example.com' } as User);
        }
        return Promise.reject(new NotFoundException('User not found'));
      },
      update: (id: number, attrs: Partial<User>) => {
        if (id === 1) {
          return Promise.resolve({ id: 1, ...attrs } as User);
        }
        return Promise.reject(new NotFoundException('User not found'));
      },
    };
    fakeAuthService = {
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
      signup: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('findUser returns a user if user with given ID exists', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
  });
  it('findUser throws NotFoundException if user with given ID does not exist', async () => {
    await expect(controller.findUser('2')).rejects.toThrow(NotFoundException);
  });
  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('test@example.com');
    expect(users).toBeDefined();
    expect(users.length).toBeGreaterThan(0);
    expect(users[0].email).toEqual('test@example.com');
  });
  it('signin updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signin(
      { email: 'test@example.com', password: 'password' },
      session,
    );
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
  it('removeUser removes a user if user with given ID exists', async () => {
    const user = await controller.removeUser('1');
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
  });
  it('removeUser throws NotFoundException if user with given ID does not exist', async () => {
    await expect(controller.removeUser('2')).rejects.toThrow(NotFoundException);
  });
  it('updateUser updates a user if user with given ID exists', async () => {
    const user = await controller.updateUser('1', {
      email: 'test@example.com',
      password: 'newpassword',
    });
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
  });
  it('updateUser throws NotFoundException if user with given ID does not exist', async () => {
    await expect(
      controller.updateUser('2', {
        email: 'test@example.com',
        password: 'newpassword',
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
