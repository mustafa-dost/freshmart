import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';

const rawSecret = process.env.JWT_SECRET?.trim();
const fallbackSecret = 'mustafa-dost-freshmart-dev-secret-2026';
const secretValue = rawSecret && rawSecret !== 'replace-with-a-long-random-secret' ? rawSecret : fallbackSecret;

if (process.env.NODE_ENV === 'production' && (!rawSecret || rawSecret === 'replace-with-a-long-random-secret')) {
  throw new Error('JWT_SECRET must be configured in production.');
}

const secret = new TextEncoder().encode(secretValue);

export async function createSession(user:{id:string;role:string;name:string}) {
  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);

  (await cookies()).set('freshmart_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSession() {
  const token = (await cookies()).get('freshmart_session')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { id: string; role: string; name: string };
  } catch {
    return null;
  }
}

export async function destroySession() {
  (await cookies()).delete('freshmart_session');
}
