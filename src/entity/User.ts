import * as bcrypt from "bcryptjs";
import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  BeforeInsert
} from "typeorm";
import { v4 } from "uuid";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") id: string;

  @Column("varchar", { length: 255 })
  email: string;

  @Column("text")
  password: string;

  @Column("boolean", { default: false })
  confirmed: boolean;

  @BeforeInsert()
  async setId() {
    this.id = v4();
  }
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
