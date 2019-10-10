import { Request } from "express";
import { User } from "../entity/User";

export interface Session extends Express.Session {
  userId?: string;
}

export interface Context {
  url: string;
  session: Session;
  sessionID: Request["sessionID"];
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
