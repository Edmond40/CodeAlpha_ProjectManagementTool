import request from 'supertest';
import app from '../src/app';

describe('Auth API', () => {
  it('should return 400 for invalid register payload', async () => {
    const response = await request(app).post('/api/v1/auth/register').send({ email: 'bad', password: 'short' });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
