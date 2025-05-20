import { autoMapFields } from '@shared/infraestructure/utils/auto-map-fields.util';
import { DateField, UUIDField } from '../../application/decorators/field.decorators';
import type { ModelOptions } from '../types/model.type';

export abstract class AbstractDto {
  @UUIDField()
  id!: string;

  @DateField()
  createdAt!: Date;

  @DateField()
  updatedAt!: Date;

  constructor(model: any, options?: ModelOptions) {
    console.log('entre aca')
    autoMapFields(this, model, options);
  }

  static fromModel<T extends AbstractDto>(
    this: new (model: any, options?: ModelOptions) => T,
    model: any,
    options?: ModelOptions
  ): T {
    return new this(model, options);
  }

  static fromModels<T extends AbstractDto>(
    this: new (model: any, options?: ModelOptions) => T,
    models: any[],
    options?: ModelOptions
  ): T[] {
    return models.map((model) => new this(model, options));
  }
}