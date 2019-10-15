// tslint:disable
// graphql typescript definitions

declare namespace GQL {
  interface IGraphQLResponseRoot {
    data?: IQuery | IMutation;
    errors?: Array<IGraphQLResponseError>;
  }

  interface IGraphQLResponseError {
    /** Required for all errors */
    message: string;
    locations?: Array<IGraphQLResponseErrorLocation>;
    /** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
    [propName: string]: any;
  }

  interface IGraphQLResponseErrorLocation {
    line: number;
    column: number;
  }

  interface IQuery {
    __typename: "Query";
    findPosts: Array<IPost>;
    dummy2: string | null;
    bye2: string | null;
    dummy: string | null;
    me: IUser | null;
    bye: IUser | null;
  }

  interface IPost {
    __typename: "Post";
    id: string;
    title: string;
    details: string;
    user: IUser | null;
    upvotes: Array<IUpvote> | null;
    upvoteCount: number;
    upvoted: boolean;
  }

  interface IUser {
    __typename: "User";
    id: string;
    email: string;
    posts: Array<IPost>;
  }

  interface IUpvote {
    __typename: "Upvote";
    id: string;
    postId: string | null;
    users: Array<IUser> | null;
  }

  interface IMutation {
    __typename: "Mutation";
    createPost: Array<IPostResponse> | null;
    deletePost: Array<IPostResponse>;
    upvotePost: Array<IPostResponse> | null;
    sendForgotPasswordEmail: boolean | null;
    forgotPasswordChange: Array<IError> | null;
    login: Array<IError> | null;
    logout: boolean | null;
    register: Array<IError> | null;
  }

  interface ICreatePostOnMutationArguments {
    input: ICreatePostInput;
  }

  interface IDeletePostOnMutationArguments {
    id: string;
  }

  interface IUpvotePostOnMutationArguments {
    id?: string | null;
  }

  interface ISendForgotPasswordEmailOnMutationArguments {
    email: string;
  }

  interface IForgotPasswordChangeOnMutationArguments {
    newPassword: string;
    key: string;
  }

  interface ILoginOnMutationArguments {
    email: string;
    password: string;
  }

  interface IRegisterOnMutationArguments {
    email: string;
    password: string;
  }

  interface ICreatePostInput {
    title: string;
    details: string;
  }

  interface IPostResponse {
    __typename: "PostResponse";
    path: string;
    message: string;
    post: IPost | null;
  }

  interface IError {
    __typename: "Error";
    path: string;
    message: string;
  }
}

// tslint:enable
