import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    console.log('LOGIN ATTEMPT:', username, password);

    // Validate input
    if (!username || !password) {
      res.status(400).json({ message: 'Username and password are required' });
      return;
    }

    // TEMPORARY: Hardcoded test user for demo purposes
    // Remove this in production and use the database instead
    if (username === 'test' && password === 'password') {
      const secret = process.env.JWT_SECRET || 'your-default-secret-key-for-dev';
      const token = jwt.sign(
        { id: 1, username: 'test' },
        secret,
        { expiresIn: '2h' }
      );
      
      res.json({ token, user: { id: 1, username: 'test' } });
      return;
    }
    
    // Standard database lookup for real users
    // Find the user
    const user = await User.findOne({ where: { username } });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET || 'your-default-secret-key-for-dev';
    const token = jwt.sign(
      { id: user.id, username: user.username },
      secret,
      { expiresIn: '2h' }
    );

    // Send response
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

const router = Router();

// POST /login - Login a user
router.post('/login', login);

export default router;
