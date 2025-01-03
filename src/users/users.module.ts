import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente, Persona, Usuario } from './entities';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: 'uploads',
        filename: (req, file, callback) => {
          // Genera un nombre de archivo único
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const newFilename = `${uniqueSuffix}-${file.originalname}`;
          callback(null, newFilename);
        },
      }),
    }),
    TypeOrmModule.forFeature([Persona]),
    TypeOrmModule.forFeature([Usuario]),
    TypeOrmModule.forFeature([Cliente]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
