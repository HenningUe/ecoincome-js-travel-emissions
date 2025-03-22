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
    /**
     * Abstract class for the base entity of all entities in the database.
     * The base entity contains the common fields for all entities.
     * 
     * The fields are:
     * - id: string - UUID of the entity
     * - isActive: boolean - Flag to indicate if the entity is active
     * - isArchived: boolean - Flag to indicate if the entity is archived
     * - createDateTime: Date - Timestamp of the creation of the entity
     * - lastChangedDateTime: Date - Timestamp of the last change of the entity
     */
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