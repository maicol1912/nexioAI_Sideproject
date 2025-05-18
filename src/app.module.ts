import { Module } from '@nestjs/common';
import { TypeOrmConfigModule } from './typeorm/typeorm.module';
import { SharedModule } from '@shared/shared.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    TypeOrmConfigModule,
    SharedModule,
    UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
