import { Entity, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Sucursal } from './sucursal.entity';
import { Usuario } from 'src/users/entities';

@Entity('usuario_sucursal')
export class UsuarioSucursal {
  @PrimaryColumn({ name: 'id_usuario' })
  idUsuario: number;

  @PrimaryColumn({ name: 'id_sucursal' })
  idSucursal: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.usuarioSucursales, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ManyToOne(() => Sucursal, (sucursal) => sucursal.usuarioSucursales)
  @JoinColumn({ name: 'id_sucursal' })
  sucursal: Sucursal;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}
