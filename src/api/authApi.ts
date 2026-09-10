import client from './client';
import type { User } from '@/types/auth';


export interface LoginRequest {
  username: string;
  password: string;
}

export async function login(data: LoginRequest): Promise<string> {
  const res = await client.post('/public/login', data);
  return res.data;
}

export async function signup(data: LoginRequest): Promise<unknown> {
  const res = await client.post('/public/signup', data);
  return res.data;
}

export async function getCurrentUser(): Promise<User> {
  const res = await client.get('/user');
  return res.data;
}

export async function healthCheck(): Promise<boolean> {
  try {
    const res = await client.get('/public/health-check');
    return res.status >= 200 && res.status < 300;
  } catch {
    return false;
  }
}