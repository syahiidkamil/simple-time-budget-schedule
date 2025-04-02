import prisma from '../utils/db/prisma';
import { hashPassword } from '../utils/auth/password';
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
    const { username, password, confirmPassword, accessCode } = req.body;

    // Basic validation
    if (!username || !password || !confirmPassword || !accessCode) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: 'Username already exists' 
      });
    }

    // Validate access code
    // 1. Get the first access code from database
    const dbAccessCode = await prisma.accessCode.findFirst({
      orderBy: {
        created_at: 'asc'
      }
    });

    // 2. Get environment access code
    const envAccessCode = process.env.ACCESS_CODE || '';

    // 3. Concatenate and check
    const validAccessCode = envAccessCode + (dbAccessCode?.code || '');
    if (accessCode !== validAccessCode) {
      return res.status(401).json({
        success: false,
        message: 'Invalid access code'
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        username,
        password_hash: passwordHash,
        // Default preferences with resetTime set to 22:00
        preferences: {
          resetTime: "22:00"
        }
      }
    });

    // Generate JWT token
    const token = generateToken(newUser);

    // Return sanitized user data and token
    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        preferences: newUser.preferences
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}