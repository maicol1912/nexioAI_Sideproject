import { StringFieldOptional, StringField, EnumField, EmailField, PhoneField, BooleanField } from "@shared/application/decorators/field.decorators";
import { AbstractDto } from "@shared/domain/abstract/abstract.dto";
import { RoleType } from "src/modules/user/domain/models/role-type";
import { UseModelDto } from "@shared/application/decorators/use-model.dto.decorator";
import { UserModel } from "src/modules/user/domain/models/user.model";



@UseModelDto(UserModel)
export class UserDto extends AbstractDto {
  @StringFieldOptional({ nullable: true })
  firstName?: string | null;

  @StringField({ nullable: false })
  lastName?: string | null;

  @StringField({ nullable: true })
  username!: string;

  @EnumField(() => RoleType)
  role?: RoleType;

  @EmailField({ nullable: true })
  email?: string | null;

  @StringField({ nullable: true })
  avatar?: string | null;

  @PhoneField({ nullable: true, region: 'CO' })
  phone?: string | null;

  @BooleanField()
  isActive?: boolean;
}
