import { post, jar } from "request-promise";

const url = process.env.TEST_HOST as string;

const registerQuery = (email: string, password: string) => `
mutation {
  register(email: "${email}", password: "${password}") {
    path
    message
  }
}
`;
const loginQuery = (email: string, password: string) => `
mutation {
  login(email: "${email}", password: "${password}") {
    path
    message
  }
}
`;
const createPostQuery = (title: string, details: string) => `
mutation {
  createPost(input: {title: "${title}", details: "${details}"}) {
    path
    message
    post { 
      id
    }
  }
}
`;
const upvotePostQuery = (id: string) => `
mutation {
  upvotePost(id: "${id}") {
    path
    message
  }
}
`;
const deletePostQuery = (id: string) => `
mutation {
  deletePost(id: "${id}") {
    path
    message
  }
}
`;

export class TestClient {
  options: {
    withCredentials: boolean;
    jar: any;
    json: boolean;
  };
  constructor() {
    this.options = {
      withCredentials: true,
      jar: jar(),
      json: true
    };
  }

  async createPost(title: string, details: string) {
    return post(url, {
      ...this.options,
      body: {
        query: createPostQuery(title, details)
      }
    });
  }

  async upvotePost(id: string) {
    return post(url, {
      ...this.options,
      body: {
        query: upvotePostQuery(id)
      }
    });
  }
  async deletePost(id: string) {
    return post(url, {
      ...this.options,
      body: {
        query: deletePostQuery(id)
      }
    });
  }

  async register(email: string, password: string) {
    return post(url, {
      ...this.options,
      body: {
        query: registerQuery(email, password)
      }
    });
  }
  async login(email: string, password: string) {
    return post(url, {
      ...this.options,
      body: {
        query: loginQuery(email, password)
      }
    });
  }
  async logout() {
    return post(url, {
      ...this.options,
      body: {
        query: `
          mutation {
            logout
          }
        `
      }
    });
  }
  async me() {
    return post(url, {
      ...this.options,
      body: {
        query: `
          {
            me {
              id
              email
            }
          }
        `
      }
    });
  }
  async forgotPasswordChange(newPassword: string, key: string) {
    return post(url, {
      ...this.options,
      body: {
        query: `
          mutation {
            forgotPasswordChange(newPassword: "${newPassword}", key: "${key}") {
              path
              message
            }
          }
        `
      }
    });
  }
}
