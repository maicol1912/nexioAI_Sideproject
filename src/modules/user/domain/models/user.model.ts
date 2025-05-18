import { AbstractModel } from "@shared/domain/abstract/abstract.model";
import { RoleType } from "./role-type";


export class UserModel extends AbstractModel {
  firstName: string | null;
  lastName: string | null;
  role: RoleType;
  email: string | null;
  password: string | null;
  phone: string | null;
  avatar: string | null;
  fullName: string;

  constructor(data: Partial<UserModel>) {
    super(data);
    Object.assign(this, data);
  }
}