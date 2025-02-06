import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1738851320275 implements MigrationInterface {
    name = 'Migration1738851320275'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "company" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT true, "isArchived" boolean NOT NULL DEFAULT false, "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying(300) NOT NULL, "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastChangedBy" character varying(300) NOT NULL, "internalComment" character varying(300), "name" character varying(300) NOT NULL, "description" character varying(300) NOT NULL, CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."travel_record_transport_mode_enum" AS ENUM('0', '1', '2', '3', '4', '5')`);
        await queryRunner.query(`CREATE TABLE "travel_record" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT true, "isArchived" boolean NOT NULL DEFAULT false, "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying(300) NOT NULL, "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastChangedBy" character varying(300) NOT NULL, "internalComment" character varying(300), "distance_km" integer NOT NULL, "transport_mode" "public"."travel_record_transport_mode_enum" NOT NULL, "travelDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "origin" character varying(300) NOT NULL, "destination" character varying(300) NOT NULL, "companyId" uuid, CONSTRAINT "PK_745a75e74c45812f4a14a45e338" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "travel_record" ADD CONSTRAINT "FK_7e5bec73859ef961a5a0b13ff3d" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "travel_record" DROP CONSTRAINT "FK_7e5bec73859ef961a5a0b13ff3d"`);
        await queryRunner.query(`DROP TABLE "travel_record"`);
        await queryRunner.query(`DROP TYPE "public"."travel_record_transport_mode_enum"`);
        await queryRunner.query(`DROP TABLE "company"`);
    }

}
