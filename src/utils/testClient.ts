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
