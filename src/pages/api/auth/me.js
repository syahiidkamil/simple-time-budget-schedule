import fs from 'fs';
import path from 'path';

// Simple function to read the JSON database
const readDB = () => {
  const dbPath = path.join(process.cwd(), 'data', 'db.json');
  const dbData = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(dbData);
};

// Simple function to write to the JSON database
const writeDB = (data) => {
  const dbPath = path.join(process.cwd(), 'data', 'db.json');
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
};

// A simple middleware to extract user from token
const getUserFromToken = (req) => {
  try {
    // Get token from auth header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    // Extract token
    const token = authHeader.split(' ')[1];
    
    // Decode token (in a real app, we would verify the token)
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    
    return decoded;
  } catch (error) {
    return null;
  }
};

export default function handler(req, res) {
  // Get user from token
  const tokenUser = getUserFromToken(req);
  
  if (!tokenUser) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }
  
  // GET request to fetch user profile
  if (req.method === 'GET') {
    try {
      // Read database
      const db = readDB();
      
      // Find user by email
      const user = db.users.find(
        (u) => u.email.toLowerCase() === tokenUser.email.toLowerCase()
      );
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
      
      // Return sanitized user data (without password)
      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Profile fetch error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
  // PATCH request to update user profile
  else if (req.method === 'PATCH') {
    try {
      const { name } = req.body;
      
      // Basic validation
      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Name is required',
        });
      }
      
      // Read database
      const db = readDB();
      
      // Find user index
      const userIndex = db.users.findIndex(
        (u) => u.email.toLowerCase() === tokenUser.email.toLowerCase()
      );
      
      if (userIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
      
      // Update user name
      db.users[userIndex].name = name;
      
      // Save to database
      writeDB(db);
      
      // Return updated user data
      res.status(200).json({
        success: true,
        user: {
          id: db.users[userIndex].id,
          name: db.users[userIndex].name,
          email: db.users[userIndex].email,
          role: db.users[userIndex].role,
        },
        message: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
  // Method not allowed
  else {
    res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }
}