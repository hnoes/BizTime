// companies.test.js

const request = require('supertest');
const app = require('../app'); // Assuming your Express app is in the app.js file

describe('Companies Routes', () => {
  it('GET /companies should return a list of companies', async () => {
    const response = await request(app).get('/companies');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('companies');
  });

  it('GET /companies/:code should return details of a specific company', async () => {
    const response = await request(app).get('/companies/your_company_code');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('company');
  });

  // Add similar tests for other routes (POST, PUT, DELETE)...

  // Example test for the new slugify feature
  it('POST /companies should create a new company with a slugified code', async () => {
    const response = await request(app)
      .post('/companies')
      .send({ name: 'Your Company Name', description: 'Your Company Description' });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('company');
    expect(response.body.company).toHaveProperty('code', 'your-company-name');
  });
});

// Add more tests as needed for your routes...
