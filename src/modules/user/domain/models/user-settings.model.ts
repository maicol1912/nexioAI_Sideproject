import type { UserModel } from "./user.model";

export class UserSettingsModel {
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
    userId?: string;
    user?: UserModel
}