import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptors';

@Module({
  imports: [TypeOrmModule.forFeature([User])], //Creates the reposoitory for us in the background
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    // Globally scoped Interceptor.. any request coming from anywhere inside our applicaetion will have the interceptor applied to it
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor,
    },
  ],
})
export class UsersModule {}
