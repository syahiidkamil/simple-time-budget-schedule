import prisma from '../utils/db/prisma';
import { verifyToken } from '../utils/auth/jwt';

export default async function handler(req, res) {
  // Only allow POST method for creating access codes
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    // This would usually require authentication, but we'll keep it simple
    const { code } = req.body;

    // Basic validation
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Access code is required'
      });
    }

    // Check if code already exists
    const existingCode = await prisma.accessCode.findUnique({
      where: { code }
    });

    if (existingCode) {
      return res.status(409).json({
        success: false,
        message: 'Access code already exists'
      });
    }

    // Create new access code
    const newAccessCode = await prisma.accessCode.create({
      data: {
        code
      }
    });

    // Return success
    return res.status(201).json({
      success: true,
      message: 'Access code created successfully',
      accessCode: {
        id: newAccessCode.id,
        code: newAccessCode.code,
        created_at: newAccessCode.created_at
      }
    });
  } catch (error) {
    console.error('Create access code error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}