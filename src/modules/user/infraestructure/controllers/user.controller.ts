import { Controller, Get, HttpCode, HttpStatus, Inject, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { UserUsecasesProxyModule } from '../usecase-proxy/user.usecase.proxy.module';
import type { UseCaseProxy } from '@shared/domain/types/usecases-proxy';
import type { UserUseCases } from '../../usecases/user.usecases';
import { UserDto } from './dtos/user.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

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

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Get('gretting/hola')
  @HttpCode(HttpStatus.OK)
  public gretting(){
    return 'hello'
  }

  @Get('gretting/hola2')
  @HttpCode(HttpStatus.OK)
  public gretting2(){
    return 'hello'
  }
}
