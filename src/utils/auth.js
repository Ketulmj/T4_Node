import jwt from 'jsonwebtoken';
import env from 'dotenv'
env.config();

const secretKey = process.env.SECRET_KEY;

function encodeJwt(data) {
  const token = jwt.sign({ data: JSON.stringify(data) }, secretKey, {
    expiresIn: '7d'
  });
  return token;
}

function decodeJwt(token) {
  try {
    const decoded = jwt.decode(token, secretKey);
    return JSON.parse(decoded.data);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export { encodeJwt, decodeJwt };
