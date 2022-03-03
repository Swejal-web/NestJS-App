/* eslint-disable prettier/prettier */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//Decorators cannot use the dependency injection system.. So it can't make use of UserService
export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    //data is never used so no arguments needed for currentUser
    //Execution not only works for http but also for GRPC web sockets instead of Request
    const request = context.switchToHttp().getRequest(); //to get session object
    return request.currentUser; //this data comes from current-user.interceptors.ts
  },
);
