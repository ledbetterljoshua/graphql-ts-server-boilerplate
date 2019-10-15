import { Request } from "express";
import { User } from "../entity/User";
import { userLoader } from "../loaders/userLoader";

export interface Session extends Express.Session {
  userId?: string;
}

export interface Context {
  url: string;
  session: Session;
  sessionID: Request["sessionID"];
  userLoader: ReturnType<typeof userLoader>;
  viewer?: User;
}

export type Resolver = (
  parent: any,
  args: any,
  context: Context,
  info: any
) => any;

export type GraphQLMiddlewareFunc = (
  resolver: Resolver,
  parent: any,
  args: any,
  context: Context,
  info: any
) => any;

export interface ResolverMap {
  [key: string]: {
    [key: string]: Resolver;
  };
}
