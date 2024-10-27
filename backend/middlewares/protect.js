const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
    let token = '';

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
        return res.status(401).json({
            message: "You are not logged in! Please log in to get access.",
        });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    console.log(decoded);
    
    req.user = decoded;
    next()
})

module.exports = { protect }