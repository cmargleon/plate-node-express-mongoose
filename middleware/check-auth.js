const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        let decoded = jwt.verify(req.headers.token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch(err) {
        return res.status(401).json({
            message: 'La autentificación falló'
        })
    }
};