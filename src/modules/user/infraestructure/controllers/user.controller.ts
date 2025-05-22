import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
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
  ) { }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Get()
  @HttpCode(HttpStatus.OK)
  public async findAll() {
    const users = await this.userUseCaseProxy.getInstance().findAll()
    return UserDto.fromModels(users, { toExclude: ['id'] })
  }

  @Get(':id')
  public async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const user = await this.userUseCaseProxy.getInstance().findOne(id)
    return UserDto.fromModel(user, { toExclude: ['id', 'createdAt'] });
  }

  @Post('create')
  public async createUser(@Body() userDto: UserDto) {
    const response = await this.userUseCaseProxy.getInstance().createUser(UserDto.toModel(userDto))
    console.log(response)

    return 'melo'
  }
}
