import { Controller, Get, HttpCode, HttpStatus, Inject, Param, ParseUUIDPipe } from '@nestjs/common';
import { UserUsecasesProxyModule } from '../usecase-proxy/user.usecase.proxy.module';
import type { UseCaseProxy } from '@shared/domain/types/usecases-proxy';
import type { UserUseCases } from '../../usecases/user.usecases';
import { UserDto } from './dtos/user.dto';

@Controller('user')
export class UserController {
  constructor(
    @Inject(UserUsecasesProxyModule.USER_USECASES_PROXY)
    private readonly userUseCaseProxy: UseCaseProxy<UserUseCases>,
  ) {}
  
  @Get()
  @HttpCode(HttpStatus.OK)
  public findAll(){
    return this.userUseCaseProxy.getInstance().findAll()
  }

  @Get(':id')
  public findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return UserDto.fromModel(this.userUseCaseProxy.getInstance().findOne(id));
  }
}
