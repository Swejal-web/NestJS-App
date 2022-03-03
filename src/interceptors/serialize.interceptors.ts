/* eslint-disable prettier/prettier */
import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

interface ClassConstructor {
  // eslint-disable-next-line @typescript-eslint/ban-types
  new (...args: any[]): {}; //as long as it is class, ts accepts it
}

export function Serialize(dto: ClassConstructor) {
  //Custom decorator
  return UseInterceptors(new SerializeInterceptor(dto));
}

// *********** Custom Interceptors *************** //

//we use implements which creates a new class that satisies all requirement of an interface(NestInterceptor)
//this is a typescript feature
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(
    context: ExecutionContext,
    handler: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    //Run  something before the response is sent out
    return handler.handle().pipe(
      map((data: any) => {
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true, //ensures it only shares properties that is marked with expose in useDTO
        });
      }),
    );
  }
}
