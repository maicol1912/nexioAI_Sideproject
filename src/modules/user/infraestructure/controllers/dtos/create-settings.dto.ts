import { BooleanFieldOptional } from "@shared/application/decorators/field.decorators";


export class CreateSettingsDto {
  @BooleanFieldOptional()
  isEmailVerified?: boolean;

  @BooleanFieldOptional()
  isPhoneVerified?: boolean;
}
