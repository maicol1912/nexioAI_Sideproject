import type { ClientProxy } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { firstValueFrom } from 'rxjs';

import { PageTypeException } from '../exceptions/page-type.exception.ts';
import type { Constructor } from '../types/app.types.ts';
import type { PageDto } from '../../application/dtos/page.dto.ts';
import type { PageMetaDto } from '../../application/dtos/page-meta.dto.ts';

/**
 * NOTE: This class designed to use with @nestjs/microservices by extending and creating a new class.
 */
export class AbstractClientService<ActionType> {
  constructor(private readonly client: ClientProxy) {}

  public async send(pattern: ActionType, data: unknown): Promise<void>;

  public async send<R>(
    pattern: ActionType,
    data: unknown,
    returnDataOptions: { class: Constructor<R>; isPage: true },
  ): Promise<PageDto<R>>;

  public async send<R>(
    pattern: ActionType,
    data: unknown,
    returnDataOptions?: { class: Constructor<R>; isPage?: false },
  ): Promise<R>;

  public async send<R, I>(
    pattern: ActionType,
    data: I,
    returnDataOptions?: Partial<{
      class?: Constructor<R>;
      isPage?: boolean;
    }>,
  ): Promise<R | PageDto<R> | void> {
    const returnData = await firstValueFrom(
      this.client.send<{ data?: R; meta?: PageMetaDto }>(pattern, data),
      {
        defaultValue: undefined,
      },
    );

    if (returnDataOptions?.isPage && (!returnData?.data || !returnData.meta)) {
      throw new PageTypeException();
    }

    if (!returnDataOptions?.class || returnDataOptions.isPage) {
      return returnData as R;
    }

    return plainToInstance(returnDataOptions.class, returnData);
  }
}
