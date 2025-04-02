import prisma from '../utils/db/prisma';
import { comparePassword } from '../utils/auth/password';
import { generateToken } from '../utils/auth/jwt';

export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username }
    });

    // Check if user exists and password matches
    if (!user || !(await comparePassword(password, user.password_hash))) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password' 
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Return user data and token (excluding password_hash)
    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        preferences: user.preferences
      },
      token,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}