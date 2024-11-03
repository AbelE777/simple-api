import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Usuario } from '../../users/entities/usuario.entity';
import { Files } from './files.entity';

@Entity('file_group')
export class FileGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  group_name: string;

  // Opcional: Relación con el usuario que creó el grupo, si deseas almacenarlo
  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  user_id: Usuario;

  // Relación de grupo a archivos
  @OneToMany(() => Files, (file) => file.group, { cascade: true })
  files: Files[];

  @CreateDateColumn()
  createdAt: Date;
}
