import request from 'supertest';
import {app} from '../server';  // Assuming your Express app is exported from server.ts
import userModel from '../models/userModel';  // Import user model to mock DB
import bcrypt from 'bcryptjs';

// Mock the userModel and bcrypt methods
jest.mock('../models/userModel');
jest.mock('bcryptjs');

describe('UserController', () => {
    let mockUser: any;
  
    beforeEach(() => {
      mockUser = {
        _id: '1',
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'hashedPassword',
        role: 'user',
        save: jest.fn(),
      };
      userModel.findOne = jest.fn().mockResolvedValue(mockUser);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      bcrypt.genSalt = jest.fn().mockResolvedValue('salt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('Login User', () => {
      it('should login successfully and return a token', async () => {
        const response = await request(app)
          .post('/api/user/login')  // Change this to /api/user/login
          .send({
            email: 'testuser@example.com',
            password: 'password123',
          })
          .set('Accept', 'application/json');
  
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.token).toBeDefined();
        expect(response.body.role).toBe('user');
      });
  
      it('should return 400 if user doesn\'t exist', async () => {
        userModel.findOne = jest.fn().mockResolvedValue(null);
        const response = await request(app)
          .post('/api/user/login')  // Change this to /api/user/login
          .send({
            email: 'nonexistentuser@example.com',
            password: 'password123',
          })
          .set('Accept', 'application/json');
  
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('User Doesn\'t exist');
      });
  
      it('should return 400 if password is incorrect', async () => {
        bcrypt.compare = jest.fn().mockResolvedValue(false);
        const response = await request(app)
          .post('/api/user/login')  // Change this to /api/user/login
          .send({
            email: 'testuser@example.com',
            password: 'wrongpassword',
          })
          .set('Accept', 'application/json');
  
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Invalid Credentials');
      });
    });
  
    describe('Register User', () => {
      it('should register successfully and return a token', async () => {
        userModel.findOne = jest.fn().mockResolvedValue(null);  // Mock user doesn't exist
  
        const response = await request(app)
          .post('/api/user/register')  // Change this to /api/user/register
          .send({
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'password123',
          })
          .set('Accept', 'application/json');
  
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.token).toBeDefined();
        expect(response.body.role).toBe('user');
      });
  
      it('should return 400 if user already exists', async () => {
        userModel.findOne = jest.fn().mockResolvedValue(mockUser);  // Mock user already exists
  
        const response = await request(app)
          .post('/api/user/register')  // Change this to /api/user/register
          .send({
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'password123',
          })
          .set('Accept', 'application/json');
  
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('User already exists');
      });
  
      it('should return 400 for invalid email', async () => {
        const response = await request(app)
          .post('/api/user/register')  // Change this to /api/user/register
          .send({
            name: 'Test User',
            email: 'invalid-email',
            password: 'password123',
          })
          .set('Accept', 'application/json');
  
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Please enter a valid email');
      });
  
      it('should return 400 for short password', async () => {
        const response = await request(app)
          .post('/api/user/register')  // Change this to /api/user/register
          .send({
            name: 'Test User',
            email: 'testuser@example.com',
            password: '123',
          })
          .set('Accept', 'application/json');
  
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Password must be at least 6 characters');
      });
    });
  });
  
