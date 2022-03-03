/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scyrpt } from 'crypto';
import { promisify } from 'util'; //will take a function that makes use of callback and gives us back the versio that makes use of promise

const scrypt = promisify(_scyrpt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // See if email is in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }

    //Hash the users password
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer; //for typescript(returns a buffer)
    const result = salt + '.' + hash.toString('hex');

    //Create a new user and save it
    const user = await this.usersService.create(email, result);

    //return the user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email); // array destructing and getting back one user
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }
    return user;
  }
}
