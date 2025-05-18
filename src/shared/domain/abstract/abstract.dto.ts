import { DateField, UUIDField } from '../../application/decorators/field.decorators';

export abstract class AbstractDto {
  @UUIDField()
  id!: string;

  @DateField()
  createdAt!: Date;

  @DateField()
  updatedAt!: Date;

  constructor(model: any, options?: { excludeFields?: boolean }) {
    if (!options?.excludeFields) {
      this.id = model.id;
      this.createdAt = model.createdAt;
      this.updatedAt = model.updatedAt;
    }
  }

  static fromModel<T extends AbstractDto>(this: new (model: any, options?: any) => T, model: any, options?: any): T {
    return new this(model, options);
  }
}

export class AbstractTranslationDto extends AbstractDto {
  constructor(model: any) {
    super(model, { excludeFields: true });
  }
}