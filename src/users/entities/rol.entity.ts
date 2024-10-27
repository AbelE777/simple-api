import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique
} from 'typeorm';

@Entity()
@Unique(['id_rol'])
export class Rol {
  @PrimaryGeneratedColumn()
  id_rol: number

  @Column()
  rol: string;
}