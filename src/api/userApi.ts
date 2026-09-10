import client from './client';
import type { UserUpdate, SentimentAnalysisUpdate } from '@/types/user';
import type { User } from '@/types/auth';

export async function updateUser(
  data: UserUpdate
): Promise<unknown> {
  const res = await client.put('/user', data);
  return res.data;
}

export async function updateSentimentAnalysis(
  data: SentimentAnalysisUpdate
): Promise<User> {
  const res = await client.put(
    '/user/sentiment-analysis',
    data
  );

  return res.data;
}

export async function deleteUser(): Promise<void> {
  await client.delete('/user');
}
