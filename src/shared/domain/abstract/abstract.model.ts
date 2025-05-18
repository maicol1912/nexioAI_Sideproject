export abstract class AbstractModel {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: Partial<AbstractModel>) {
    Object.assign(this, data);
  }
}