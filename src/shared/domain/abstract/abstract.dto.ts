import { IsOptional } from 'class-validator';
import { DateField, UUIDField } from '../../application/decorators/field.decorators';
import type { ModelOptions } from '../types/model.type';

interface AbstractDtoConstructor<D extends AbstractDto> {
  new(...args: any[]): D;
  fromModel<M>(model: M, options?: ModelOptions & { toExclude?: (keyof D)[] }): D;
}

export abstract class AbstractDto {
  @IsOptional()
  @UUIDField()
  id!: string;

  @IsOptional()
  @DateField()
  createdAt!: Date;

  @IsOptional()
  @DateField()
  updatedAt!: Date;

  static fromModel<M, D extends AbstractDto>(
    this: new (...args: any[]) => D,
    model: M,
    options?: ModelOptions & { toExclude?: (keyof D)[] },
  ): D {
    const modelClass = (this as any).modelClass;
    console.log(modelClass);
    if (!modelClass) {
      throw new Error(
        `You need to use @UseModelDto on class (${this.name}) to be able to call fromModel function`,
      );
    }
    const instance = new this();
    Object.assign(instance, model);
    if (options?.toExclude) {
      options.toExclude.forEach((key) => {
        delete (instance as any)[key];
      });
    }
    return instance;
  }

  static fromModels<M, D extends AbstractDto>(
    this: AbstractDtoConstructor<D>,
    models: M[],
    options?: ModelOptions & { toExclude?: (keyof D)[] },
  ): D[] {
    if (!models) {
      throw new Error('Models array is null or undefined');
    }
    return models.map((model) => this.fromModel(model, options));
  }

  static toModel<M, D extends AbstractDto>(
    this: AbstractDtoConstructor<D>,
    dto: D,
    options?: ModelOptions & { toExclude?: (keyof D)[] },
  ): M {
    const modelClass = (this as any).modelClass;
    console.log(modelClass);
    if (!modelClass) {
      throw new Error(
        `You need to use @UseModelDto on class (${this.name}) to be able to call toModel function`,
      );
    }
    const instance = new modelClass();
    Object.assign(instance, dto);
    if (options?.toExclude) {
      options.toExclude.forEach((key) => {
        delete (instance as any)[key];
      });
    }
    return instance;
  }
}