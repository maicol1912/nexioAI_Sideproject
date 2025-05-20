declare global {
  type Uuid = string & { _uuidBrand: undefined };
  type Todo = unknown & { _todoBrand?: never };

  interface Array<T> {
    toModels<Model extends AbstractDto>(
      this: T[],
      options?: { toExclude?: string[] }
    ): Model[];

    toPageDto<Dto extends AbstractDto>(
      this: T[],
      pageMetaDto: PageMetaDto,
      options?: { toExclude?: string[] }
    ): PageDto<Dto>;
  }
}

// Esto asegura que TypeScript trate este archivo como un módulo
export { };
