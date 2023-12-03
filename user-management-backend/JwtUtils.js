const jwt = require('jsonwebtoken');
const fs = require('fs');

const privateKey = fs.readFileSync('private.pem');

function generateToken(user) {
    return jwt.sign(user, privateKey, { algorithm: 'RS256', expiresIn: '1d' });
}

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, privateKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

module.exports = { generateToken, authenticateToken };
