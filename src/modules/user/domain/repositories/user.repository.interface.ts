import type { UserModel } from "../../domain/models/user.model"


export interface UserRepository {
  saveUser(user: UserModel): Promise<UserModel>
  findOneUserByUsername(username: string): Promise<UserModel>
  findOne(id: string): Promise<UserModel | undefined>
  findAll() : Promise<Array<UserModel>>
}
