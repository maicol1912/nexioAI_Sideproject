import _ from 'lodash';
import type { ObjectLiteral } from 'typeorm';
import { Brackets, SelectQueryBuilder } from 'typeorm';
import type { AbstractEntity } from '../../domain/abstract/abstract.entity';
import type { AbstractDto } from '../../domain/abstract/abstract.dto';
import { PageDto } from '../../application/dtos/page.dto';
import { PageMetaDto } from '../../application/dtos/page-meta.dto';
import type { PageOptionsDto } from '../../application/dtos/page-options.dto';
import type { KeyOfType } from '../../domain/types/app.types';
import type { AbstractModel } from '@shared/domain/abstract/abstract.model';

declare module 'typeorm' {
  interface SelectQueryBuilder<Entity> {
    searchByString(
      q: string,
      columnNames: string[],
      options?: {
        formStart: boolean;
      },
    ): this;

    paginate(
      this: SelectQueryBuilder<Entity>,
      pageOptionsDto: PageOptionsDto,
      options?: Partial<{ takeAll: boolean; skipCount: boolean }>,
    ): Promise<[Entity[], PageMetaDto]>;

    leftJoinAndSelect<AliasEntity extends AbstractEntity, A extends string>(
      this: SelectQueryBuilder<Entity>,
      property: `${A}.${Exclude<
        KeyOfType<AliasEntity, AbstractEntity>,
        symbol
      >}`,
      alias: string,
      condition?: string,
      parameters?: ObjectLiteral,
    ): this;

    leftJoin<AliasEntity extends AbstractEntity, A extends string>(
      this: SelectQueryBuilder<Entity>,
      property: `${A}.${Exclude<
        KeyOfType<AliasEntity, AbstractEntity>,
        symbol
      >}`,
      alias: string,
      condition?: string,
      parameters?: ObjectLiteral,
    ): this;

    innerJoinAndSelect<AliasEntity extends AbstractEntity, A extends string>(
      this: SelectQueryBuilder<Entity>,
      property: `${A}.${Exclude<
        KeyOfType<AliasEntity, AbstractEntity>,
        symbol
      >}`,
      alias: string,
      condition?: string,
      parameters?: ObjectLiteral,
    ): this;

    innerJoin<AliasEntity extends AbstractEntity, A extends string>(
      this: SelectQueryBuilder<Entity>,
      property: `${A}.${Exclude<
        KeyOfType<AliasEntity, AbstractEntity>,
        symbol
      >}`,
      alias: string,
      condition?: string,
      parameters?: ObjectLiteral,
    ): this;
  }
}

Array.prototype.toModels = function <Model extends AbstractDto>(options?: { toExclude?: string[] }): Model[] {
  return this.map((item) => item.toModel?.(options)).filter((item) => item !== null && item !== undefined) as Model[];
};

Array.prototype.toPageDto = function <Dto extends AbstractDto>(
  pageMetaDto: PageMetaDto,
  options?: { toExclude?: string[] }
): PageDto<Dto> {
  return new PageDto(this.toModels<Dto>(options), pageMetaDto);
};

SelectQueryBuilder.prototype.searchByString = function (
  q,
  columnNames,
  options,
) {
  if (!q) {
    return this;
  }

  this.andWhere(
    new Brackets((qb) => {
      for (const item of columnNames) {
        qb.orWhere(`${item} ILIKE :q`);
      }
    }),
  );

  if (options?.formStart) {
    this.setParameter('q', `${q}%`);
  } else {
    this.setParameter('q', `%${q}%`);
  }

  return this;
};

SelectQueryBuilder.prototype.paginate = async function (
  pageOptionsDto: PageOptionsDto,
  options?: Partial<{
    skipCount: boolean;
    takeAll: boolean;
  }>,
) {
  if (!options?.takeAll) {
    this.skip(pageOptionsDto.skip).take(pageOptionsDto.take);
  }

  const entities = await this.getMany();

  let itemCount = -1;

  if (!options?.skipCount) {
    itemCount = await this.getCount();
  }

  const pageMetaDto = new PageMetaDto({
    itemCount,
    pageOptionsDto,
  });

  return [entities, pageMetaDto];
};
