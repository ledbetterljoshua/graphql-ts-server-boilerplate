import { Redis } from "ioredis";

export interface Session {
  userId?: string;
  cookie: {
    userId?: string;
    path: string;
    _expires: Date;
    originalMaxAge: number;
    httpOnly: boolean;
    secure: boolean;
  };
}

export type Resolver = (
  parent: any,
  args: any,
  context: {
    redis: Redis;
    url: string;
    session: Session;
  },
  info: any
) => any;

export type GraphQLMiddlewareFunc = (
  resolver: Resolver,
  parent: any,
  args: any,
  context: {
    redis: Redis;
    url: string;
    session: Session;
  },
  info: any
) => any;

export interface ResolverMap {
  [key: string]: {
    [key: string]: Resolver;
  };
}
