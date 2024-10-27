import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Usuario, Persona, Cliente, UpdatePersonData } from './entities';
import { Repository, EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async create(registerUserDto: RegisterUserDto): Promise<Usuario> {
    try {
      const {
        telefono,
        nombres,
        apellidos,
        direccion,
        cedula,
        genero,
        fecha_nacimiento,
        username,
        password,
        email,
        rol,
      } = registerUserDto;
      console.log(registerUserDto);

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      // persona
      const persona = new Persona();
      persona.nombres = nombres;
      persona.apellidos = apellidos;
      persona.cedula = cedula;
      persona.telefono = telefono;
      persona.email = email;
      persona.direccion = direccion;
      persona.genero = genero;
      persona.fecha_nacimiento = fecha_nacimiento;
      persona.rol = rol;
      // usuario
      const user = new Usuario();
      user.usuario = username;
      user.password = hashedPassword;
      user.rol = rol;
      user.fk_persona = persona;

      await this.personaRepository.manager.transaction(async (manager) => {
        await manager.save(persona);
        await manager.save(user);
        if (rol === 3) {
          const cliente = new Cliente();
          cliente.precio = registerUserDto.precio;
          cliente.profesion = registerUserDto.profesion;
          cliente.zona = registerUserDto.zona;
          cliente.fk_usuario = user;

          await manager.save(cliente);
        }
      });

      delete user.password;
      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(error.detail);
      } else {
        throw error;
      }
    }
  }

  async findOne(id: number): Promise<Usuario> {
    return this.usuarioRepository.findOne({
      where: { id_usuario: id },
    });
  }

  async findByUsername(usuario: string): Promise<Usuario> {
    return this.usuarioRepository.findOne({
      where: { usuario },
      relations: ['fk_persona'],
    });
  }

  async getAllUsers(): Promise<Usuario[]> {
    return this.usuarioRepository.find({
      where: [{ rol: 1 }, { rol: 2 }],
      relations: ['fk_persona'],
    });
  }

  async getAllUsersClientes(): Promise<Cliente[]> {
    return this.clienteRepository.find({
      relations: ['fk_usuario', 'fk_usuario.fk_persona'],
    });
  }

  async uploadFiles(files: Express.Multer.File[]) {
    console.log(files)
  }

  async updateprofilePic(
    id: number,
    body: { imgUrl: string },
  ): Promise<Usuario> {
    // buscamos por id
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id },
    });
    // Si no se encuentra el usuario, return excepción NotFoundException
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    usuario.profile_img = body.imgUrl;
    delete usuario.password;
    await this.usuarioRepository.save(usuario);

    return usuario;
  }

  async updateprofileData(
    id: number,
    body: UpdatePersonData,
  ): Promise<Persona> {
    // buscamos por id
    console.log('body', body);
    const persona = await this.personaRepository.findOne({
      where: { id_persona: id },
    });
    // Si no se encuentra el usuario, return excepción NotFoundException
    if (!persona) {
      throw new NotFoundException('Usuario no encontrado');
    }
    await this.personaRepository.update(id, body);

    return await this.personaRepository.findOne({
      where: { id_persona: id },
    });
  }

  async getClienteById(id: number): Promise<Cliente[]> {
    return this.clienteRepository.find({
      where: { id_cliente: id },
      relations: ['fk_usuario', 'fk_usuario.fk_persona'],
    });
  }
}
