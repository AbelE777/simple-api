import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  Unique,
  ManyToOne,
} from 'typeorm';
import { Usuario } from '../../users/entities/usuario.entity';
import { FileGroup } from './fileGroup.entity';

@Entity('files')
export class Files {
  @PrimaryGeneratedColumn()
  id_file: number;

  @Column()
  file_name: string;

  @Column()
  original_file_name: string;
  
  @Column()
  file_path: string;
  
  @Column()
  type: string;

  // @OneToOne(() => Persona, { cascade: true, onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'fk_id_persona' })
  // fk_persona: Usuario;
  @ManyToOne(() => Usuario, (usuario) => usuario.files, { onDelete: 'CASCADE' })
  user_id: Usuario;

  @ManyToOne(() => FileGroup, (group) => group.files, { onDelete: 'CASCADE' })
  group: FileGroup; // Relación con FilesGroup


  @CreateDateColumn()
  createdAt: Date;
}
