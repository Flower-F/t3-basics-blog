import jwt from 'jsonwebtoken';

const SECRET = process.env.SECRET || 'DEFAULT_SECRET';

export function signJwt(data: Record<string, unknown>) {
  return jwt.sign(data, SECRET);
}

export function verifyJwt<T>(token: string) {
  return jwt.verify(token, SECRET) as T;
}
