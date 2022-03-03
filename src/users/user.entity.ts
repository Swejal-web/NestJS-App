/* eslint-disable prettier/prettier */
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id', this.id);
  }

  @AfterUpdate()
  LogUpdated() {
    console.log('Updated User with id', this.id);
  }

  @AfterRemove()
  LogDelete() {
    console.log('Deleted User with id', this.id);
  }
}
