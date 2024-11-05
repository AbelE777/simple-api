import { Module } from '@nestjs/common';
import { UsersController } from '../users/users.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Files } from './entities/files.entity';
import { FileGroup } from './entities/fileGroup.entity';
import { Cliente, Persona, Usuario } from '../users/entities';
@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: 'uploads',
        filename: (req, file, callback) => {
          // Genera un nombre de archivo único
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const newFilename = `${file.originalname}-${uniqueSuffix}`;
          callback(null, newFilename);
        },
      }),
    }),
    TypeOrmModule.forFeature([Files]),
    TypeOrmModule.forFeature([FileGroup]),
    TypeOrmModule.forFeature([Usuario]),
    TypeOrmModule.forFeature([Cliente]),
    TypeOrmModule.forFeature([Persona]),
  ],
  providers: [FilesService],
  controllers: [FilesController],
  exports: [FilesService],
})
export class FilesModule {}
