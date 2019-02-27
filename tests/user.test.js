const { Server, seed, getError } = require('./helpers');
const models = require('../src/models');
const redis = require('../src/redis');

describe('User', () => {
  let server;

  beforeAll(async () => {
    server = new Server();
    await server.start();
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(async () => {
    await seed.reset();
    await seed.admin();
    await seed.user(2, { validated: true });
    await seed.user(1, { active: false, validated: true });
    await server.login('admin', '123456');
  });

  test('Users exists in DB', async () => {
    const usersCount = await models.User.count();
    expect(usersCount).toBe(4);
  });

  test('Query "users" as admin', async () => {
    const { users: allUsers } = await server.client.request(
      `
        {
          users {
            username
            name
          }
        }
      `,
    );
    expect(allUsers).toHaveLength(4);
  });

  test('Query "user" by id as admin', async () => {
    const admin = await models.User.findOne({
      where: {
        username: 'admin',
      },
    });

    const { user } = await server.client.request(
      `
        query user($id: ID!){
          user(id: $id) {
            id
            username
            name
          }
        }
      `,
      {
        id: admin.id,
      },
    );
    expect(user.id).toBe(admin.id);
    expect(user.username).toBe(admin.username);
  });

  test('Query "me" returns logged in user', async () => {
    const { me } = await server.client.request(
      `
        {
          me {
            username
            name
            contact {
              phone
              address
              geopoint {
                lat
                lng
              }
            }
          }
        }
      `,
    );
    expect(me.username).toBe('admin');
    expect(me.name).toBe('Admin');
    expect(me.contact).toBeNull();
  });

  test('Query "me" with not logged in user', async () => {
    try {
      await server.request(
        `
          {
            me {
              username
              name
            }
          }
        `,
      );
    } catch ({ response }) {
      expect(response.data).toBeNull();
      expect(response.errors).toHaveLength(1);
      expect(getError(response.errors)).toBe('USER_IS_NOT_LOGGED_IN');
    }
  });

  test('Create full user with new username', async done => {
    const { signup } = await server.request(
      `
        mutation signup($data: UserCreateInput!) {
          signup(data: $data) {
            id
            username
            name
            email
            contact {
              phone
              address
              geopoint {
                lat
                lng
              }
            }
          }
        }
      `,
      {
        data: seed.newUser,
      },
    );

    expect(typeof signup.id).toBe('string');
    expect(signup.username).toBe(seed.newUser.username);
    expect(signup.email).toBe(seed.newUser.email);
    expect(signup.contact).not.toBeNull();
    expect(signup.contact).toEqual(seed.newUser.contact);

    const user = await models.User.findOne({ where: { id: signup.id } });
    expect(user).not.toBeNull();
    expect(user.username).toBe(signup.username);

    const contact = await models.Contact.findOne({
      where: { address: signup.contact.address },
    });
    expect(contact).not.toBeNull();
    expect(contact.phone).toBe(signup.contact.phone);

    redis.get(`user:validation:${signup.id}`, (_, code) => {
      expect(code).not.toBeNull();
      expect(typeof code).toBe('string');
      expect(code).toHaveLength(6);
      done();
    });
  });

  test('Create user with existing username', async () => {
    try {
      await server.request(
        `
        mutation signup($data: UserCreateInput!) {
          signup(data: $data) {
            id
          }
        }
      `,
        {
          data: { ...seed.newUser, username: 'admin' },
        },
      );
    } catch ({ response }) {
      expect(getError(response.errors)).toBe('USER_EXISTS');
    }
  });

  test('Create user with existing email', async () => {
    try {
      await server.request(
        `
        mutation signup($data: UserCreateInput!) {
          signup(data: $data) {
            id
          }
        }
      `,
        {
          data: {
            ...seed.newUser,
            email: 'admin@admin.com',
          },
        },
      );
    } catch ({ response }) {
      expect(getError(response.errors)).toBe('EMAIL_EXISTS');
    }
  });

  test('Login with invalidated user', async () => {
    await seed.user(1, { username: 'user' });

    try {
      await server.request(
        `
          mutation login($username: String!, $password: String!) {
            login(username: $username, password: $password) {
              token
            }
          }
        `,
        {
          username: 'user',
          password: '123456',
        },
      );
    } catch ({ response }) {
      expect(getError(response.errors)).toBe('USER_IS_NOT_VALIDATED');
    }
  });

  test('Login with inactive user', async () => {
    await seed.user(1, { username: 'user', active: false, validated: true });

    try {
      await server.request(
        `
          mutation login($username: String!, $password: String!) {
            login(username: $username, password: $password) {
              token
            }
          }
        `,
        {
          username: 'user',
          password: '123456',
        },
      );
    } catch ({ response }) {
      expect(getError(response.errors)).toBe('USER_IS_NOT_ACTIVE');
    }
  });

  test('Login admin', async () => {
    const { login } = await server.request(
      `
        mutation login($username: String!, $password: String!) {
          login(username: $username, password: $password) {
            token
            user {
              id
              username
            }
          }
        }
      `,
      {
        username: 'admin',
        password: '123456',
      },
    );
    expect(typeof login.token).toBe('string');
    expect(login.user.username).toBe('admin');
  });

  test('Login with validated user', async () => {
    const [user] = await seed.user(1, { username: 'user', validated: true });

    const { login } = await server.request(
      `
        mutation login($username: String!, $password: String!) {
          login(username: $username, password: $password) {
            token
            user {
              id
              username
            }
          }
        }
      `,
      {
        username: 'user',
        password: '123456',
      },
    );
    expect(typeof login.token).toBe('string');
    expect(login.user.id).toBe(user.id);
    expect(login.user.username).toBe(user.username);
  });

  test('Login with invalid password', async () => {
    try {
      await server.request(
        `
        mutation login($username: String!, $password: String!) {
          login(username: $username, password: $password) {
            token
          }
        }
        `,
        {
          username: 'admin',
          password: 'admin',
        },
      );
    } catch ({ response }) {
      expect(getError(response.errors)).toBe('INVALID_PASSWORD');
    }
  });
});
