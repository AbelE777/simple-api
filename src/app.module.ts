import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { Persona, Usuario, Cliente } from './users/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationModule } from '../config/config.module';
import { ConfigModule } from '@nestjs/config';
import { FilesModule } from './files/files.module';
import { Files } from './files/entities/files.entity';
import { FileGroup } from './files/entities/fileGroup.entity';

@Module({
  imports: [
    ConfigurationModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [Persona, Usuario, Cliente, Files, FileGroup],
      synchronize: true,
    }),
    // ConfigModule.forRoot(),
    AuthModule,
    UsersModule,
    FilesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
