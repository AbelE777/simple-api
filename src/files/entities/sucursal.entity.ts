import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UsuarioSucursal } from './usuario-sucursal.entity';

@Entity('sucursal')
export class Sucursal {
  @PrimaryGeneratedColumn({ name: 'id_sucursal' })
  idSucursal: number;

  @Column({ name: 'nombre_sucursal', length: 90 })
  nombreSucursal: string;

  @Column({ length: 190 })
  direccion: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @OneToMany(() => UsuarioSucursal, (usuarioSucursal) => usuarioSucursal.sucursal)
  usuarioSucursales: UsuarioSucursal[];
}
