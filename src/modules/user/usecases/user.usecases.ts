import type { IBcryptService } from "@shared/domain/adapters/bcrypt.interface"
import type { UserRepository } from "../domain/repositories/user.repository.interface"
import type { UserModel } from "../domain/models/user.model"
import { UserNotFoundException } from "../domain/exceptions/user-not-found.exception"


export class UserUseCases {
    constructor(private readonly userRepository: UserRepository, private readonly bcryptService: IBcryptService) { }

    async createUser(user: UserModel):Promise<UserModel> {
        user.password = await this.bcryptService.hash(user.password ?? '')
        return await this.userRepository.saveUser(user)
    }

    async findAll(): Promise<Array<UserModel>> {
        return await this.userRepository.findAll()
    }

    async findOne(id: string): Promise<UserModel> {
        const user = await this.userRepository.findOne(id)

        if (!user) {
            throw new UserNotFoundException()
        }
        return user
    }
}