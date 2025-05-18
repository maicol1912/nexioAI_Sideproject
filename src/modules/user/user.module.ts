import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infraestructure/entities/user.entity';
import { UserController } from './infraestructure/controllers/user.controller';
import { DatabaseUserRepository } from './infraestructure/repositories/user.repository';
import { BcryptService } from '@shared/infraestructure/services/bcrypt/bcrypt.service';
import { UserUsecasesProxyModule } from './infraestructure/usecase-proxy/user.usecase.proxy.module';
import { SharedModule } from '@shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    UserUsecasesProxyModule.register(),
    SharedModule
  ],
  controllers: [UserController],
  providers: [
    DatabaseUserRepository,
    BcryptService
  ],
  exports: [
    DatabaseUserRepository,
    BcryptService
  ]
})
export class UserModule {}