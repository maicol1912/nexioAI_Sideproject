import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../infraestructure/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository.interface';
import type { UserModel } from '../../domain/models/user.model';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';

@Injectable()
export class DatabaseUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
  ) { }

  async saveUser(user: UserModel): Promise<UserModel> {
    const userSaved = await this.userEntityRepository.save(user);
    return this.userEntityRepository.create(userSaved).toModel();
  }

  async findAll(): Promise<Array<UserModel>> {
    const users = await this.userEntityRepository.find()
    return users.toModels();
  }

  async findOne(id: string): Promise<UserModel | undefined> {
    const user = await this.userEntityRepository.findOne({ where: { id } })

    return user?.toModel()
  }

  async findOneUserByUsername(username: string): Promise<UserModel> {
    const user = await this.userEntityRepository.findOne({ where: { email: username } });
    if (!user) {
      throw new UserNotFoundException(username);
    }
    return user.toModel()
  }


}
