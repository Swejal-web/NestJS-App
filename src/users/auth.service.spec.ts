/* eslint-disable prettier/prettier */
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    //Create a fake copy of users service
    const users: User[] = [];

    // fakeUsersService = {
    //     find: () => Promise.resolve([])
    // }  //use this if the function is way to complex

    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService, //if anyone asks UsersService then gives fakeUsersService
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('asdf@asdf.com', 'asdf');
    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with an email already in use', (done) => {
    service
      .signup('asdf@asdf.com', 'asdf')
      .then(() => service.signup('asdf@asdf.com', 'asdf').catch(() => done()));
    //for error handling. if an error is returned catch it and call the done fucntion to conclude that the test is working
  });

  it('throws error if signin with invalid email', (done) => {
    service.signin('asdf@gmail.com', 'hgo').catch(() => done());
  });

  it('throws error if an invalid password is provided', (done) => {
    service.signup('asf@gmail.com', 'hell').then(() => {
      service.signin('asf@gmail.com', 'hello').catch(() => done()); //if the code doesn not reache4s done than test will throw exceeded timeout error
    });
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('asdf@gmail.com', 'hell');
    const user = await service.signin('asdf@gmail.com', 'hell');
    expect(user).toBeDefined();
  });
});
