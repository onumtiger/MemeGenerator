const env = require('../env.json')
const jwt = require('jsonwebtoken');

/**
 * This middleware can be used to protect routs
 * if route is procted token is needed to access it
 * @param {Request} req - Express Request Object
 * @param {Response} res - Express Response Object
 * @param {Function} next - Next function
 */
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, env.jwtKey);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};
