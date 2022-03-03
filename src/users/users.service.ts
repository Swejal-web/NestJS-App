import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  repo: Repository<User>;
  constructor(@InjectRepository(User) repo: Repository<User>) {
    this.repo = repo;
  }

  create(email: string, password: string) {
    const user = this.repo.create({ email, password }); //create an instance of an entity
    console.log(user);
    return this.repo.save(user); //persists data in the database
    //hooks dont run in User entity if we directly save user without creating an instance
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.repo.findOne(id);
  }

  find(email: string) {
    return this.repo.find({ email });
  }

  async update(id: number, attrs: Partial<User>) {
    //if you directly use update then it will not call the hooks in the entity class
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found'); //NotFoundException will only work for http and not for websockets or grpc
    }
    Object.assign(user, attrs); //copy properties of attrs to user
    return this.repo.save(user);
  } //Partial takes either none, one or all properties in User entity

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.repo.remove(user);
    // if we use delete(id) it will not call the hooks
  }
}
