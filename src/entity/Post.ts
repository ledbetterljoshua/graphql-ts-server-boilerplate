import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany
} from "typeorm";
import { User } from "./User";
import { Upvote } from "./Upvote";

@Entity("posts")
export class Post extends BaseEntity {
  @ManyToOne(() => User, user => user.posts, {
    cascade: true,
    onDelete: "CASCADE"
  })
  user: User;

  @OneToMany(() => Upvote, upvote => upvote.post)
  upvotes: Upvote[];

  @PrimaryGeneratedColumn("uuid") id: string;

  @Column("varchar", { length: 100 })
  title: string;

  @Column("varchar", { length: 100 })
  details: string;

  @Column("uuid") userId: string;
}
