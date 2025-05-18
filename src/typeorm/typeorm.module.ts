import { Module } from '@nestjs/common';
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EnvironmentConfigService } from '../enviroment-config/environment-config.service';
import { EnvironmentConfigModule } from '../enviroment-config/enviroment.config.module';
import { UserEntity } from 'src/modules/user/infraestructure/entities/user.entity';


export const getTypeOrmModuleOptions = (
  config: EnvironmentConfigService,
): TypeOrmModuleOptions => config.postgresConfig;

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: getTypeOrmModuleOptions,
    })
  ],
})
export class TypeOrmConfigModule {}
