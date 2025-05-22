export abstract class AbstractModel {
  id?: string | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;

  constructor(data: Partial<AbstractModel>) {
    this.id = data?.id;
    this.createdAt = data?.createdAt;
    this.updatedAt = data?.updatedAt;
    Object.assign(this, data);
  }
}