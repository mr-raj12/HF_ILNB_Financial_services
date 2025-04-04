import KiteConnect from 'kiteconnect';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getKiteClient(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.apiKey || !user.accessToken) {
    throw new Error('User not found or not authenticated with Zerodha');
  }

  const kite = new KiteConnect({
    api_key: user.apiKey,
  });

  kite.setAccessToken(user.accessToken);

  return kite;
}

export async function generateSession(
  apiKey: string,
  apiSecret: string,
  requestToken: string
) {
  const kite = new KiteConnect({
    api_key: apiKey,
  });

  try {
    const session = await kite.generateSession(requestToken, apiSecret);
    return session;
  } catch (error) {
    console.error('Failed to generate session:', error);
    throw error;
  }
}