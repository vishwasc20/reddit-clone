import { MigrationInterface, QueryRunner } from "typeorm";
import { mockPostsData } from "../mock-data/mock-posts";

export class FakePosts1621174171862 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(mockPostsData);
  }

  public async down(_: QueryRunner): Promise<void> {}
}
