import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileGroup } from './entities/fileGroup.entity';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';
import * as mime from 'mime-types';
import archiver = require('archiver');
import { join } from 'path';
import { existsSync } from 'fs';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Post('upload-file')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 10)) // 'files' es el nombre del campo en el formulario, 10 es el límite de archivos
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('groupName') groupName: string,
    @Req() req: any,
  ): Promise<any> {
    const userId = req?.user.id_usuario as number;
    return await this.filesService.uploadFiles(files, userId, groupName);
  }

  @Get('groups')
  @UseGuards(JwtAuthGuard)
  async getFileGroupsWithMeta(
    @Req() req: any,
    @Query() query: any,
  ): Promise<FileGroup[]> {
    let active = query.active
    const userId = req?.user.id_usuario as number;
    return await this.filesService.getFileGroupsWithMeta(userId, active);
  }

  @Delete('delete/:groupId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logicDeletion(@Param('groupId') id, @Query() query: any,) {
    let active = query.active
    return await this.filesService.logicDeletionOrRestore(id, active);
  }

  @Get('download/:id')
  @UseGuards(JwtAuthGuard)
  async downloadFile(@Param('id') id: number, @Res() res: Response) {
    const file = await this.filesService.findFileById(id);
    if (!file) {
      throw new NotFoundException('Archivo no encontrado');
    }

    const filePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'uploads',
      file.file_name,
    );

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(
        'Error: no se encontró el archivo en el servidor',
      );
    }

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${file.original_file_name}"`,
    });
    fs.createReadStream(filePath).pipe(res);
  }

  @Get('view/:id')
  @UseGuards(JwtAuthGuard)
  async viewFile(@Param('id') id: number, @Res() res: Response) {
    const file = await this.filesService.findFileById(id);
    if (!file) {
      throw new NotFoundException('File not found');
    }

    const filePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'uploads',
      file.file_name,
    );
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(
        'Error: no se encontró el archivo en el servidor',
      );
    }

    const mimeType = mime.lookup(filePath) || 'application/octet-stream';
    console.log(mimeType);

    res.set({
      'Content-Type': mimeType, // Establece el tipo de contenido adecuado
      'Content-Disposition': 'inline; filename=' + file.original_file_name,
    });

    fs.createReadStream(filePath).pipe(res);
  }

  @Get('download-all/:groupId')
  @UseGuards(JwtAuthGuard)
  async downloadAllFiles(
    @Param('groupId') groupId: number,
    @Res() res: Response,
  ) {
    const files = await this.filesService.findFilesByGroupId(groupId);

    if (!files || files.length === 0) {
      throw new NotFoundException('No files found for this group');
    }

    // Configura la respuesta para descarga
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="files_group_${groupId}.zip"`,
    );

    // Crea el archivo .zip
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Nivel de compresión máximo
    });

    // Pipe del archivo .zip a la respuesta
    archive.pipe(res);

    // Agrega los archivos al archivo .zip
    for (const file of files) {
      const filePath = join(
        __dirname,
        '..',
        '..',
        '..',
        'uploads',
        file.file_name,
      );
      if (existsSync(filePath)) {
        archive.file(filePath, { name: file.original_file_name });
      }
    }

    // Finaliza la compresión y envía el archivo
    await archive.finalize();
  }
}
