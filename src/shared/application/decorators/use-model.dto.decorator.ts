export function UseModelDto(modelClass: any) {
  return function (target: any) {
    target.modelClass = modelClass;
  };
}