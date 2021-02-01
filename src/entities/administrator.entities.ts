/* eslint-disable prettier/prettier */
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import * as Validator from 'class-validator';

@Index('uq_administrator_email', ['email'], { unique: true })
@Entity('administrator')
export class Administrator {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'administrator_id',
    unsigned: true,
  })
  administratorId: number;

  @Column('varchar', { name: 'email', unique: true, length: 128 })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Matches(/^[a-z][a-z0-9\.]{3,30}[a-z0-9]$/)
  email: string;

  @Column('varchar', { name: 'password_hash', length: 255 })
  @Validator.IsNotEmpty()
  @Validator.IsHash('sha512')
  passwordHash: string;
}
