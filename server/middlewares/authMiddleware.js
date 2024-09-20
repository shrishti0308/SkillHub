const jwt = require('jsonwebtoken');

const jwtSecret = 'skill_hub_secret_key';

exports.authenticateJWT = (req, res, next) => {
    const authHeader = req.header('Authorization');

    // Check if Authorization header exists and starts with "Bearer "
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1]; // Extract the token after "Bearer"

        try {
            const verified = jwt.verify(token, jwtSecret);
            req.user = verified;
            next(); // Continue if token is valid
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    } else {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }
};
