import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente, Persona, Usuario } from './entities';
@Module({
  imports: [
    TypeOrmModule.forFeature([Persona]),
    TypeOrmModule.forFeature([Usuario]),
    TypeOrmModule.forFeature([Cliente]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
