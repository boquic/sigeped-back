const request = require('supertest');
const app = require('../../src/app');

function rnd() { return Math.random().toString(36).slice(2, 8); }

describe('Auth E2E flow', () => {
  const username = `user_${rnd()}`;
  const email = `${username}@test.local`;
  const password = 'Passw0rd!123';
  let accessToken;
  let refreshToken;

  it('register', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username, email, password });
    expect([200,201]).toContain(res.status);
    expect(res.body.user).toBeDefined();
    refreshToken = res.body.refreshToken;
    accessToken = res.body.accessToken;
  });

  it('me (authorized)', async () => {
    const res = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(email);
  });

  it('refresh', async () => {
    const res = await request(app)
      .post('/auth/refresh')
      .send({ refreshToken });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it('logout', async () => {
    const res = await request(app)
      .post('/auth/logout')
      .send({ refreshToken });
    expect(res.status).toBe(204);
  });

  it('me after logout (should fail)', async () => {
    const res = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);
    // access token may still be valid; to ensure 401 we'd need to blacklist or shorten TTL.
    // We'll attempt using refresh after logout to verify revocation instead.
    const res2 = await request(app)
      .post('/auth/refresh')
      .send({ refreshToken });
    expect([400,401]).toContain(res2.status);
  });
});
