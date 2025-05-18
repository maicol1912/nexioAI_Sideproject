// src/shared/application/decorators/use-model.decorator.ts
import type { Constructor } from "../../domain/types/app.types";

export function UseModel(modelClass: Constructor): ClassDecorator {
  return (ctor) => {
    if (!(modelClass as unknown)) {
      throw new Error('UseModel decorator requires modelClass');
    }
    ctor.prototype.modelClass = modelClass;
  };
}