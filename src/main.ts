import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeTransactionalContext } from 'typeorm-transactional';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { ClassSerializerInterceptor, HttpStatus, UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { Transport } from '@nestjs/microservices';
import { Reflector } from '@nestjs/core';
import { HttpExceptionFilter } from './shared/application/filters/bad-request.filter';
import { QueryFailedFilter } from './shared/application/filters/query-failed.filter';
import { EnvironmentConfigService } from './enviroment-config/environment-config.service';
import { GlobalResponseInterceptor } from './shared/application/interceptors/response-interceptor.service';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(helmet());
  app.setGlobalPrefix('/api');
  app.use(compression());
  app.use(morgan('combined'));
  app.enableVersioning();

  const reflector = app.get(Reflector);

  app.useGlobalFilters(
    new HttpExceptionFilter(reflector),
    new QueryFailedFilter(reflector),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector),
    new GlobalResponseInterceptor()
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: true,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  );

  const configService = app.select(SharedModule).get(EnvironmentConfigService);

  if (configService.natsEnabled) {
    const natsConfig = configService.natsConfig;
    app.connectMicroservice({
      transport: Transport.NATS,
      options: {
        url: `nats://${natsConfig.host}:${natsConfig.port}`,
        queue: 'main_service',
      },
    });

    await app.startAllMicroservices();
  }

  const port = configService.appConfig.port;

  await app.listen(port);
  console.info(`server running on ${await app.getUrl()}`);

  return app;
}
export const app = bootstrap();
