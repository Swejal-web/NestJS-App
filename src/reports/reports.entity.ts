/* eslint-disable prettier/prettier */
import { User } from '../users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  approved: boolean;

  @Column()
  price: number;

  @Column()
  make: string; //company

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  lat: number;

  @Column()
  lng: number;

  @Column()
  mileage: number;

  @ManyToOne(() => User, (user) => user.reports) // function that returns Report entity class, and function that takes instance of report and retuurn user.reports
  //we create a callback function for this instead of just using User because it will create circular dependency which results in undefined
  user: User;
}
