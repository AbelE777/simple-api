import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Files } from './entities/files.entity';
import { Usuario } from 'src/users/entities';
import { FileGroup } from './entities/fileGroup.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(Files) private filesRepository: Repository<Files>,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(FileGroup)
    private fileGroupRepository: Repository<FileGroup>,
  ) {}

  async logicDeletionOrRestore(id: number, active: string): Promise<void> {
    const result = await this.fileGroupRepository.update(
      { id },
      { active },
    );

    if (result.affected === 0) {
      throw new NotFoundException(`Grupo con ID ${id} no encontrado`);
    }
  }

  async uploadFiles(
    files: Express.Multer.File[],
    userId: number,
    groupName: string,
  ) {
    const allFilesSaved = files.every((file) => file.path && file.filename);

    if (!allFilesSaved) {
      throw new Error('Error al guardar archivos');
    }

    // Busca el usuario por ID
    const user = await this.usuarioRepository.findOne({
      where: { id_usuario: userId },
    });
    if (!user) {
      throw new Error('User not found'); // Maneja el error como consideres apropiado
    }

    try {
      // Paso 1: Crear el grupo y obtener el ID
      const newGroup = new FileGroup();
      newGroup.group_name = groupName;
      newGroup.user_id = { id_usuario: userId } as Usuario;

      // Guarda el grupo en la base de datos
      const savedGroup = await this.fileGroupRepository.save(newGroup);

      // Guardar todos los archivos en una transacción
      const savedFiles = await this.filesRepository.manager.transaction(
        async (manager) => {
          return await Promise.all(
            files.map(async (file) => {
              const fileInstance = new Files();
              fileInstance.file_path = file.path;
              fileInstance.file_name = file.filename;
              fileInstance.type = file.mimetype;
              fileInstance.original_file_name = file.originalname;
              fileInstance.user_id = { id_usuario: userId } as Usuario;
              fileInstance.group = { id: savedGroup.id } as FileGroup;

              return manager.save(fileInstance);
            }),
          );
        },
      );

      const message =
        savedFiles.length > 1
          ? `${savedFiles.length} archivos subidos y guardados con éxito!`
          : `${savedFiles.length} archivo subido y guardado con éxito!`;

      return {
        message,
        files: savedFiles.map((file) => ({
          filePath: file.file_path,
          fileName: file.file_name,
          originalName: file.original_file_name,
          groupId: savedGroup.id,
        })),
      };
    } catch (error) {
      console.error('Error al guardar archivos:', error);
      throw new Error('No se pudieron guardar los archivos.');
    }
  }

  async getFileGroupsWithMeta(userId: number, active: string): Promise<FileGroup[]> {
    const options: any = {
      relations: ['files', 'user_id'],
      select: {
        id: true,
        group_name: true,
        createdAt: true,
        updatedAt: true,
        user_id: {
          id_usuario: true,
          usuario: true,
          profile_img: true,
        },
      },
    };

    // Aplicar el filtro solo si userId es diferente de 1
    if (userId === 1) {
      options.where = { active };
    }
    // Aplicar el filtro solo si userId es diferente de 1
    if (userId !== 1) {
      options.where = { user_id: { id_usuario: userId }, active };
    }
    return await this.fileGroupRepository.find(options);
  }

  async findFileById(id: number): Promise<Files | undefined> {
    return await this.filesRepository.findOne({ where: { id_file: id } });
  }

  async findFilesByGroupId(groupId: number): Promise<Files[]> {
    return await this.filesRepository.find({
      where: {
        // Aquí suponemos que tienes una relación en el modelo Files que se llama `group`
        group: { id: groupId },
      },
    });
  }
}
