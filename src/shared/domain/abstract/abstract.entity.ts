// src/shared/domain/abstract/abstract.entity.ts
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class AbstractEntity<M = any, O = never> {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  toModel(options?: O): M {
    const modelClass = (this.constructor as any).prototype.modelClass;
    
    if (!modelClass) {
      throw new Error(
        `You need to use @UseModel on class (${this.constructor.name}) to be able to call toModel function`,
      );
    }
    
    return new modelClass(this);
  }
}