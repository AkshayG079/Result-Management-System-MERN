const jwt = require('jsonwebtoken');

exports.module = generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_KEY, {
        expiresIn: '15d'
    })
}