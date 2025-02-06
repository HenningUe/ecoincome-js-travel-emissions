import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1738848050146 implements MigrationInterface {
    name = 'Migration1738848050146'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Company" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT true, "isArchived" boolean NOT NULL DEFAULT false, "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying(300) NOT NULL, "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastChangedBy" character varying(300) NOT NULL, "internalComment" character varying(300), "name" character varying(300) NOT NULL, "description" character varying(300) NOT NULL, CONSTRAINT "PK_b4993a6b3d3194767a59698298f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."TravelRecord_transport_mode_enum" AS ENUM('0', '1', '2', '3', '4', '5')`);
        await queryRunner.query(`CREATE TABLE "TravelRecord" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT true, "isArchived" boolean NOT NULL DEFAULT false, "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying(300) NOT NULL, "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastChangedBy" character varying(300) NOT NULL, "internalComment" character varying(300), "distance_km" integer NOT NULL, "transport_mode" "public"."TravelRecord_transport_mode_enum" NOT NULL, "travelDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "origin" character varying(300) NOT NULL, "destination" character varying(300) NOT NULL, "companyId" uuid, CONSTRAINT "PK_0ea200e4f0c25cf90c61ed8c058" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "TravelRecord" ADD CONSTRAINT "FK_3e9c35c56cec758f7634f9052be" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "TravelRecord" DROP CONSTRAINT "FK_3e9c35c56cec758f7634f9052be"`);
        await queryRunner.query(`DROP TABLE "TravelRecord"`);
        await queryRunner.query(`DROP TYPE "public"."TravelRecord_transport_mode_enum"`);
        await queryRunner.query(`DROP TABLE "Company"`);
    }

}
