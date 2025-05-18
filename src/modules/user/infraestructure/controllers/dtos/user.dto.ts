import { StringFieldOptional, EnumFieldOptional, EmailFieldOptional, PhoneFieldOptional, BooleanFieldOptional } from "@shared/application/decorators/field.decorators";
import { AbstractDto } from "@shared/domain/abstract/abstract.dto";
import { RoleType } from "src/modules/user/domain/models/role-type";
import type { UserEntity } from "../../entities/user.entity";
import { UseModelDto } from "@shared/application/decorators/use-model.dto.decorator";
import { UserModel } from "src/modules/user/domain/models/user.model";


// TODO, remove this class and use constructor's second argument's type
export type UserDtoOptions = Partial<{ isActive: boolean }>;

@UseModelDto(UserModel)
export class UserDto extends AbstractDto {
  @StringFieldOptional({ nullable: true })
  firstName?: string | null;

  @StringFieldOptional({ nullable: true })
  lastName?: string | null;

  @StringFieldOptional({ nullable: true })
  username!: string;

  @EnumFieldOptional(() => RoleType)
  role?: RoleType;

  @EmailFieldOptional({ nullable: true })
  email?: string | null;

  @StringFieldOptional({ nullable: true })
  avatar?: string | null;

  @PhoneFieldOptional({ nullable: true })
  phone?: string | null;

  @BooleanFieldOptional()
  isActive?: boolean;

  constructor(user: UserEntity, options?: UserDtoOptions) {
    super(user);
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.role = user.role;
    this.email = user.email;
    this.avatar = user.avatar;
    this.phone = user.phone;
    this.isActive = options?.isActive;
  }
}
