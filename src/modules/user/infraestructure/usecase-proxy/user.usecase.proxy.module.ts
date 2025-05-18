import { type DynamicModule, Module } from '@nestjs/common';
import { UseCaseProxy } from '@shared/domain/types/usecases-proxy';
import { DatabaseUserRepository } from '../repositories/user.repository';
import { BcryptService } from '@shared/infraestructure/services/bcrypt/bcrypt.service';
import { UserUseCases } from '../../usecases/user.usecases';
import { UserModule } from '../../user.module';

@Module({})
export class UserUsecasesProxyModule {
  // Constante para el caso de uso
  static USER_USECASES_PROXY = 'UserUseCasesProxy';

  static register(): DynamicModule {
    return {
      module: UserUsecasesProxyModule,
      imports: [UserModule],
      providers: [
        {
          provide: UserUsecasesProxyModule.USER_USECASES_PROXY,
          inject: [DatabaseUserRepository, BcryptService],
          useFactory: (
            userRepo: DatabaseUserRepository,
            bcryptService: BcryptService,
          ) => new UseCaseProxy(new UserUseCases(userRepo, bcryptService)),
        },
      ],
      exports: [UserUsecasesProxyModule.USER_USECASES_PROXY],
    };
  }
}