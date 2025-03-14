import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import * as pg from 'pg';
//import pg from 'pg'

pg.defaults.parseInputDatesAsUTC = true;
const dateParser = pg.types.getTypeParser(pg.types.builtins.TIMESTAMP);
pg.types.setTypeParser(
  pg.types.builtins.TIMESTAMP,
  (val: string) => dateParser(`${val}Z`),
);

export abstract class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'boolean', default: false })
    isArchived: boolean;

    @CreateDateColumn({default: () => 'CURRENT_TIMESTAMP' })
    createDateTime: Date;

    @UpdateDateColumn({default: () => 'CURRENT_TIMESTAMP' })
    lastChangedDateTime: Date;
}