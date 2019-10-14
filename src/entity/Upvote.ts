import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable
} from "typeorm";
import { User } from "./User";
import { Post } from "./Post";

@Entity("upvotes")
export class Upvote extends BaseEntity {
  @ManyToOne(() => Post, post => post.upvotes)
  post: Post;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @PrimaryGeneratedColumn("uuid") id: string;

  @Column("uuid") postId: string;
  @Column("uuid") userId: string;
}
