import type { Constructor } from "../../domain/types/app.types";

export function UseModelDto(modelClass: Constructor): ClassDecorator {
  return (ctor) => {
    if (!(modelClass as unknown)) {
      throw new Error('UseModelDto decorator requires modelClass');
    }
    ctor.prototype.modelClass = modelClass;
  };
}