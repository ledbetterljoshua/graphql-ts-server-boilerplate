import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne
} from "typeorm";
import { User } from "./User";

@Entity("posts")
export class Post extends BaseEntity {
  @ManyToOne(() => User, user => user.posts)
  user: User;

  @PrimaryGeneratedColumn("uuid") id: string;

  @Column("varchar", { length: 100 })
  title: string;

  @Column("varchar", { length: 100 })
  details: string;

  @Column("uuid") userId: string;
}
