import { MigrationInterface, QueryRunner } from "typeorm";
import { mockPostsData } from "../mock-data/mock-posts";
import { mockUsersData } from "../mock-data/mock-user";

export class FakePosts1621174171869 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(mockUsersData);
    await queryRunner.query(mockPostsData);
  }

  public async down(_: QueryRunner): Promise<void> {}
}
