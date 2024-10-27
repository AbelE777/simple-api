import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['email'])
export class Persona {
  @PrimaryGeneratedColumn()
  id_persona: number;

  @Column()
  nombres: string;

  @Column()
  apellidos: string;

  @Column()
  cedula: string;

  @Column()
  telefono: string;

  @Column()
  email: string;

  @Column()
  direccion: string;

  @Column()
  genero: string;

  @Column()
  fecha_nacimiento: Date;

  @Column()
  rol: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
