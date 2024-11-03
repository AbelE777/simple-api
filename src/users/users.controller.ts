import {
  Controller,
  Get,
  UseGuards,
  Param,
  Put,
  Body,
  Post,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Cliente, Persona, UpdatePersonData, Usuario } from './entities';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers(): Promise<Usuario[]> {
    return await this.usersService.getAllUsers();
  }

  @Get('clientes')
  @UseGuards(JwtAuthGuard)
  async getAllUsersClientes(): Promise<Cliente[]> {
    return await this.usersService.getAllUsersClientes();
  }

  @Post('upload-file')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 10)) // 'files' es el nombre del campo en el formulario, 10 es el límite de archivos
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<any> {
    return await this.usersService.uploadFiles(files)
  }

  @Put('update-profile/:id')
  @UseGuards(JwtAuthGuard)
  async updateprofilePic(
    @Param('id') id: string,
    @Body() body: { imgUrl: string },
  ): Promise<Usuario> {
    const id_ = Number(id);
    return await this.usersService.updateprofilePic(id_, body);
  }

  @Put('update-profile-data/:id')
  @UseGuards(JwtAuthGuard)
  async updateprofileData(
    @Param('id') id: string,
    @Body() body: UpdatePersonData,
  ): Promise<Persona> {
    const id_ = Number(id);
    return await this.usersService.updateprofileData(id_, body);
  }

  // Nueva ruta para obtener cliente por ID
  @Get('clientes/:id')
  @UseGuards(JwtAuthGuard)
  async getClienteById(@Param('id') id: string): Promise<Cliente[]> {
    const id_ = Number(id);
    return await this.usersService.getClienteById(id_);
  }
}
