import { MigrationInterface, QueryRunner } from 'typeorm';

export class initialize1687534587363 implements MigrationInterface {
  name = 'initialize1687534587363';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const queries = [
      'CREATE TABLE "wallet" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "network_type" text NOT NULL, "seed" text NOT NULL, "extended_public_key" text NOT NULL, "type" text NOT NULL, "required_sign" integer, "version" integer NOT NULL DEFAULT (1))',
      'CREATE TABLE "address" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "address" text NOT NULL, "network_type" text NOT NULL, "path" text NOT NULL, "idx" integer NOT NULL DEFAULT (-1), "process_height" integer NOT NULL DEFAULT (0), "walletId" integer, CONSTRAINT "address_network_type" UNIQUE ("address", "network_type"), CONSTRAINT "FK_d64b03f42b8bcc40894545264d7" FOREIGN KEY ("walletId") REFERENCES "wallet" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)',
      'CREATE TABLE "asset" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "asset_id" text NOT NULL, "network_type" text NOT NULL, "box_id" text, "height" integer NOT NULL, "name" text, "decimal" integer DEFAULT (0), "description" text, "emission_amount" text, "tx_id" text, CONSTRAINT "asset_id_network_type" UNIQUE ("asset_id", "network_type"))',
      'CREATE TABLE "box" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "tx_id" text NOT NULL, "spend_tx_id" text, "box_id" text NOT NULL, "create_index" integer NOT NULL, "create_timestamp" integer NOT NULL, "create_height" integer NOT NULL, "spend_index" integer, "spend_height" integer, "spend_timestamp" integer, "serialized" text NOT NULL, "addressId" integer, CONSTRAINT "box_id_for_address" UNIQUE ("addressId", "box_id"), CONSTRAINT "FK_14236ae97af5ea5b397608f7407" FOREIGN KEY ("addressId") REFERENCES "address" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)',
      'CREATE TABLE "config" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" text NOT NULL, "value" text NOT NULL, CONSTRAINT "UQ_26489c99ddbb4c91631ef5cc791" UNIQUE ("key"))',
      'CREATE TABLE "multi_sig_key" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "extended_key" text NOT NULL, "walletId" integer, "signWalletId" integer, CONSTRAINT "FK_f8f8c03baf6f0883d0b033f72cd" FOREIGN KEY ("walletId") REFERENCES "wallet" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_45e564a88d4a263bb7ddef5897b" FOREIGN KEY ("signWalletId") REFERENCES "wallet" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)',
      'CREATE TABLE "multi-sign-row" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "txId" text NOT NULL, "walletId" integer, CONSTRAINT "UQ_22d166a78ef90e8aab23a82a01d" UNIQUE ("txId"), CONSTRAINT "FK_1b325330483aa43fab64703fe7a" FOREIGN KEY ("walletId") REFERENCES "wallet" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)',
      'CREATE TABLE "multi-sign-tx" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "bytes" text NOT NULL, "idx" integer NOT NULL, "type" text NOT NULL, "txId" integer, CONSTRAINT "FK_05595439c77fd3771bf77e84cf5" FOREIGN KEY ("txId") REFERENCES "multi-sign-row" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)',
      'CREATE TABLE "multi-sign-input" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "bytes" text NOT NULL, "txId" integer, CONSTRAINT "FK_621d2a7eff19a8e95e22da1ab40" FOREIGN KEY ("txId") REFERENCES "multi-sign-row" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)',
      'CREATE TABLE "multi-commitment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "bytes" text NOT NULL, "index" integer NOT NULL, "inputIndex" integer NOT NULL, "secret" text, "txId" integer, CONSTRAINT "FK_9d5228b8828161d8eb2c8286196" FOREIGN KEY ("txId") REFERENCES "multi-sign-row" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)',
      'CREATE TABLE "multi-signer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "signer" text NOT NULL, "type" text NOT NULL, "txId" integer, CONSTRAINT "FK_fa7710bd6c52dc52a08ab8181fe" FOREIGN KEY ("txId") REFERENCES "multi-sign-row" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)',
      'CREATE TABLE "address_value_info" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "token_id" text NOT NULL, "amount" text NOT NULL, "type" text NOT NULL, "addressId" integer, CONSTRAINT "UQ_63226be7c2b47dc0379f911454c" UNIQUE ("token_id", "addressId", "type"), CONSTRAINT "FK_f4ee502c88b667ae85cb934fc67" FOREIGN KEY ("addressId") REFERENCES "address" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)',
      'CREATE TABLE "saved-address" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "address" text NOT NULL, "name" text NOT NULL)',
    ];
    for (const query of queries) {
      await queryRunner.query(query);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const queries = [
      'DROP TABLE "saved-address"',
      'DROP TABLE "address_value_info"',
      'DROP TABLE "asset"',
      'DROP TABLE "config"',
      'DROP TABLE "multi-signer"',
      'DROP TABLE "multi-commitment"',
      'DROP TABLE "multi-sign-input"',
      'DROP TABLE "multi-sign-tx"',
      'DROP TABLE "multi-sign-row"',
      'DROP TABLE "multi_sig_key"',
      'DROP TABLE "box"',
      'DROP TABLE "address"',
      'DROP TABLE "wallet"',
    ];
    for (const query of queries) {
      await queryRunner.query(query);
    }
  }
}
