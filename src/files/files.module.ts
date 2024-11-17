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
import { Sucursal } from './entities/sucursal.entity';
import { UsuarioSucursal } from './entities/usuario-sucursal.entity';
@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: 'uploads',
        filename: (req, file, callback) => {
          function agregarSufijo(nombreArchivo:string, sufijo: string) {
            const indicePunto = nombreArchivo.lastIndexOf('.');
            
            // Si no hay punto, asumimos que no tiene extensión
            if (indicePunto === -1) {
              return `${nombreArchivo}-${sufijo}`;
            }
            
            const nombre = nombreArchivo.substring(0, indicePunto);
            const extension = nombreArchivo.substring(indicePunto);
            
            return `${nombre}-${sufijo}${extension}`;
          }
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const newFilename = agregarSufijo(file.originalname, uniqueSuffix)
          callback(null, newFilename);
        },
      }),
    }),
    TypeOrmModule.forFeature([Files]),
    TypeOrmModule.forFeature([Sucursal]),
    TypeOrmModule.forFeature([UsuarioSucursal]),
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
