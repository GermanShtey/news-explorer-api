const jwt = require('jsonwebtoken');
const UnauthorizedErr = require('../errors/unauthorized-err');
const { devJWT } = require('../utils/config');

const { JWT_SECRET, NODE_ENV } = process.env;

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedErr('Необходима авторизация');
    }
    const token = await authorization.replace('Bearer ', '');
    const jwtSecret = NODE_ENV === 'production' ? JWT_SECRET : devJWT;
    let payload;

    try {
      payload = await jwt.verify(token, jwtSecret);
    } catch (err) {
      next(new UnauthorizedErr('Необходима авторизация'));
    }

    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }

  return null;
};
