declare global {
  type Uuid = string & { _uuidBrand: undefined };
  type Todo = unknown & { _todoBrand?: never };

  interface Array<T> {
    toModels<Model extends import('./src/shared/domain/abstract/abstract.model').AbstractDto>(
      this: T[],
      options?: unknown,
    ): Model[];

    toPageDto<Dto extends import('./src/shared/domain/abstract/abstract.model').AbstractDto>(
      this: T[],
      pageMetaDto: import('./src/shared/application/dtos/page-meta.dto').PageMetaDto,
      options?: unknown,
    ): import('./src/shared/application/dtos/page-meta.dto').PageDto<Dto>;
  }
}

// Esto asegura que TypeScript trate este archivo como un módulo
export {};
