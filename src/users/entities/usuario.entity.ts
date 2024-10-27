import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Persona } from './persona.entity';
import * as bcrypt from 'bcrypt';

@Entity()
@Unique(['usuario'])
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column()
  usuario: string;

  @Column()
  password: string;

  @OneToOne(() => Persona, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_id_persona' })
  fk_persona: Persona;

  @Column()
  rol: number;

  @Column({
    default:
      'https://res.cloudinary.com/de0ncdhdk/image/upload/v1680118926/default-user_kbyl9r.jpg',
  })
  profile_img: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
