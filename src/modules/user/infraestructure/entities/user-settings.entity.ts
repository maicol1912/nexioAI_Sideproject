import type { Relation } from 'typeorm';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity.ts';
import { AbstractEntity } from '@shared/domain/abstract/abstract.entity.ts';
import { UseModel } from '@shared/application/decorators/use-model.decorator.ts';
import { UserSettingsModel } from '../../domain/models/user-settings.model.ts';
import type { UserDto } from '../controllers/dtos/user.dto.ts';


@Entity({ name: 'user_settings' })
@UseModel(UserSettingsModel)
export class UserSettingsEntity extends AbstractEntity<UserDto> {
  @Column({ default: false })
  isEmailVerified?: boolean;

  @Column({ default: false })
  isPhoneVerified?: boolean;

  @Column({ type: 'uuid' })
  userId?: string;

  @OneToOne(() => UserEntity, (user) => user.settings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: Relation<UserEntity>;
}
