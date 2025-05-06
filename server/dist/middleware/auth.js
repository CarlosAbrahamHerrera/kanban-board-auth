import jwt from 'jsonwebtoken';
// Authentication middleware for protected routes
export const authMiddleware = (req, res, next) => {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    // Check if no token
    if (!token) {
        res.status(401).json({ message: 'No token, authorization denied' });
        return;
    }
    try {
        // Verify token
        const secret = process.env.JWT_SECRET || 'your-default-secret-key-for-dev';
        const decoded = jwt.verify(token, secret);
        // Add user data to request
        req.user = {
            username: decoded.username,
            id: decoded.id
        };
        next();
    }
    catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
        return;
    }
};
