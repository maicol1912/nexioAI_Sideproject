import { AbstractEntity} from "@shared/domain/abstract/abstract.entity";
import { RoleType } from "src/modules/user/domain/models/role-type";
import { Entity, Column, VirtualColumn, OneToOne } from "typeorm";
import { UserDto, type UserDtoOptions } from "../controllers/dtos/user.dto";
import { UserSettingsEntity } from "./user-settings.entity";
import { UserModel } from "../../domain/models/user.model";
import { UseModel } from "@shared/application/decorators/use-model.decorator";


@Entity({ name: 'users' })
@UseModel(UserModel)
export class UserEntity extends AbstractEntity<UserModel> {
  @Column({ nullable: true, type: 'varchar' })
  firstName!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  lastName!: string | null;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role!: RoleType;

  @Column({ unique: true, nullable: true, type: 'varchar' })
  email!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  password!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  phone!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  avatar!: string | null;

  @VirtualColumn({
    query: (alias) =>
      `SELECT CONCAT(${alias}.first_name, ' ', ${alias}.last_name)`,
  })
  fullName!: string;

  @OneToOne(() => UserSettingsEntity, (userSettings) => userSettings.user)
  settings?: UserSettingsEntity;

}
