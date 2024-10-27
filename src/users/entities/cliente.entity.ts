import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Persona } from './persona.entity';
import { Usuario } from './usuario.entity';

@Entity()
export class Cliente {
  @PrimaryGeneratedColumn()
  id_cliente: number;

  @Column()
  profesion: string;

  @Column()
  precio: number;

  @Column()
  zona: string;

  @OneToOne(() => Usuario, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_id_usuario' })
  fk_usuario: Usuario;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
