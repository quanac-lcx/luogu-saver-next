import { BaseEntity, Entity, PrimaryColumn, Column, Index, CreateDateColumn } from "typeorm";

import { Type } from "class-transformer";

import { TaskStatus, TaskType } from '@/constants/task';

@Index("idx_expire_time", ["expireTime"])

@Entity({ name: 'task' })
export class Task extends BaseEntity {
    @PrimaryColumn({ type: 'varchar', length: 8 })
    id: string;

    @Column({ type: 'text' })
    info: string;

    @Column({ type: 'int', default: TaskStatus.PENDING })
    status: Task;

    @CreateDateColumn({ name: 'created_at' })
    @Type(() => Date)
    createdAt: Date;

    @Column({ name: "expire_time" })
    @Type(() => Date)
    expireTime: Date;

    @Column({ type: 'int' })
    type: TaskType;

    @Column({ name: "oid" })
    originId: string;
}